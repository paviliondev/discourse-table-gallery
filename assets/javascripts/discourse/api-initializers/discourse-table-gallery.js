import { apiInitializer } from "discourse/lib/api";
import discourseComputed from "discourse-common/utils/decorators";

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
      renderTemplate(controller, model) {
        const categoryId = model.category.id;
        const isGalleryCategory = galleryCategoryIds.includes(categoryId);

        if (isGalleryCategory) {
          // render new nav system
          console.log("rendering table gallery");
          this.render("gallery/table-gallery-navigation", {
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
        return tableGalleryNavigationController.get("listViewState");
      } else {
        return this._super(...arguments);
      }
    },
  });
});
