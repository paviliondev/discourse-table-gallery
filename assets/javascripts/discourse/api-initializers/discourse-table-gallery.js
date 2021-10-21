import { apiInitializer } from "discourse/lib/api";
import discourseComputed from "discourse-common/utils/decorators";
import PermissionType from "discourse/models/permission-type";

export default apiInitializer("0.11.1", (api) => {
  const siteSettings = api.container.lookup("site-settings:main");
  const tableGalleryNavigationController = api.container.lookup(
    "controller:gallery/table-gallery-navigation"
  );
  const galleryCategoryIds = siteSettings.table_gallery_categories
    .split("|")
    .map((id) => parseInt(id, 10));

  ["discovery.category"].forEach((name) => {
    api.modifyClass(`route:${name}`, {
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
          console.log("rendering table gallery");
          this.render("gallery/table-gallery-navigation", {
            controller: "gallery/table-gallery-navigation",
            outlet: "navigation-bar",
          });
        } else {
          // normal behaviour
          console.log("rendering normal behaviour");
          this.render("navigation/category", { outlet: "navigation-bar" });
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
    });
  });

  api.modifyClass("service:topic-thumbnails", {
    @discourseComputed(
      "viewingCategoryId",
      "viewingTagId",
      "router.currentRoute.metadata.customThumbnailMode",
      "isTopicListRoute"
    )
    displayMode(
      viewingCategoryId,
      viewingTagId,
      customThumbnailMode,
      isTopicListRoute
    ) {
      if (galleryCategoryIds.includes(viewingCategoryId)) {
        // this lets us tell topic-thumbnails to show a list or a grid,
        // based on the property from our controller instead of its own settings
        // NOTE: this appears to update once, needs to update on controller change
        return tableGalleryNavigationController.get("listViewState");
      } else {
        return this._super(...arguments);
      }
    },
  });
});
