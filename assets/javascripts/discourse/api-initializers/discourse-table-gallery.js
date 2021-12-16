import { apiInitializer } from "discourse/lib/api";
import discourseComputed, {
  observes,
  on,
} from "discourse-common/utils/decorators";
import PermissionType from "discourse/models/permission-type";
import { scheduleOnce } from "@ember/runloop";
import { inject as controller } from "@ember/controller";
import { queryParams } from "discourse/controllers/discovery-sortable";
import { createPopper } from "@popperjs/core";

export default apiInitializer("0.11.1", (api) => {
  const siteSettings = api.container.lookup("site-settings:main");
  if (!siteSettings.discourse_table_gallery_enabled) return;

  const galleryCategoryIds = siteSettings.table_gallery_categories
    .split("|")
    .map((id) => parseInt(id, 10));

  const rParams = queryParams;
  const cParams = Object.keys(queryParams);
  rParams["tags"] = { refreshModel: true, replace: true };
  cParams.push("tags");

  const tags_callback = function (topic, params) {
    if (topic.get("tags").length > 3) {
      const numExcessTags = topic.get("tags").length - 3;
      return "<span class='discourse-tag'>(+" + numExcessTags + ")</span>";
    }
  };

  api.addTagsHtmlCallback(tags_callback, { priority: 100 });

  ["discovery.category"].forEach((name) => {
    api.modifyClass(`route:${name}`, {
      pluginId: "discourse-table-gallery",
      queryParams: rParams,

      _setupNavigation(category) {
        this._super(...arguments);
        const noSubcategories = false,
          filterType = this.filter(category).split("/")[0];

        this.controllerFor("gallery/table-gallery-navigation").setProperties({
          category,
          filterType,
          noSubcategories,
        });
      },

      setupController(controller, model) {
        const topics = this.topics,
          category = model.category,
          canCreateTopic = topics.get("can_create_topic"),
          canCreateTopicOnCategory =
            canCreateTopic &&
            category.get("permission") === PermissionType.FULL;

        this.controllerFor("gallery/table-gallery-navigation").setProperties({
          canCreateTopicOnCategory: canCreateTopicOnCategory,
          cannotCreateTopicOnCategory: !canCreateTopicOnCategory,
          canCreateTopic: canCreateTopic,
        });

        // call to super needs to be after override, because at the end it unsets the topic property we're using
        this._super(...arguments);
      },

      // overriding the template rendering so we can change the navigation system
      renderTemplate(controller, model) {
        const categoryId = model.category.id;
        const isGalleryCategory = galleryCategoryIds.includes(categoryId);

        if (isGalleryCategory) {
          // render new nav system
          this.render("gallery/table-gallery-navigation", {
            controller: "gallery/table-gallery-navigation",
            outlet: "navigation-bar",
          });

          scheduleOnce("afterRender", () =>
            $("body").addClass("table-gallery")
          );
        } else {
          // normal behaviour
          this.render("navigation/category", { outlet: "navigation-bar" });
          scheduleOnce("afterRender", () =>
            $("body").removeClass("table-gallery")
          );
        }

        if (this._categoryList) {
          this.render("discovery/categories", {
            outlet: "header-list-container",
            model: this._categoryList,
          });
        }

        this.render("discovery/topics", {
          outlet: "list-container",
        });
      },

      deactivate() {
        $("body").removeClass("table-gallery");
      },
    });

    api.modifyClass(`controller:${name}`, { queryParams: cParams });
  });

  api.modifyClass("component:topic-list-item", {
    pluginId: "discourse-table-gallery",

    didInsertElement() {
      this._super();
      this.topicThumbnailsService.shouldDisplay;
    },

    @on("didInsertElement")
    @observes("topicThumbnailsService.shouldDisplay")
    setupPopper() {
      if (this.topicThumbnailsService.shouldDisplay) {
        scheduleOnce("afterRender", () => {
          const container = this.element.querySelector(".link-top-line");
          const element = this.element.querySelector(
            ".topic-list-title-popover"
          );

          this._popper = createPopper(container, element, {
            placement: "auto",
            modifiers: [
              {
                name: "preventOverflow",
              },
              {
                name: "offset",
                options: {
                  offset: [5, 5],
                },
              },
            ],
          });
        });
      } else {
        this._popper = null;
      }
    },

    @observes("topicThumbnailsService.shouldDisplay")
    rerenderTopicListItem() {
      // note that this is rerender, not render - we don't want conflict with thumbnails version
      // (which is already overriding Discourse)
      this.renderTopicListItem(); // this is from thumbnail theme
    },
  });

  api.modifyClass("service:topic-thumbnails", {
    pluginId: "discourse-table-gallery",

    init() {
      // this runs when service is initialized, we're using it to make controller computed properties available to service
      this._super(...arguments);
      const tableGalleryNavigationController = api.container.lookup(
        "controller:gallery/table-gallery-navigation"
      );
      // making controller (and by extension listViewState) available to displayMode as computed property
      this.set(
        "tableGalleryNavigationController",
        tableGalleryNavigationController
      );
    },

    @discourseComputed(
      "viewingCategoryId",
      "viewingTagId",
      "router.currentRoute.metadata.customThumbnailMode",
      "isTopicListRoute",
      "tableGalleryNavigationController.listViewState"
    )
    displayMode(
      viewingCategoryId,
      viewingTagId,
      customThumbnailMode,
      isTopicListRoute,
      listViewState
    ) {
      if (galleryCategoryIds.includes(viewingCategoryId)) {
        // this lets us tell topic-thumbnails to show a list or a grid,
        // based on the property from our controller instead of its own settings
        return listViewState;
      } else {
        return this._super(...arguments);
      }
    },
  });
});
