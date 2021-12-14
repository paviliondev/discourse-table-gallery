import NavigationCategoryController from "discourse/controllers/navigation/category";

// this controller manages the table-gallery-navigation template, we're initialising the variables used there
export default NavigationCategoryController.extend({
  listViewState: "grid",
  filterInput: "",

  init() {
    this._super(...arguments);
    const queryParams = new URLSearchParams(window.location.search);
    const tags = queryParams.get("tags");

    if (tags && tags.includes("enterprise")) {
      this.set("galleryState", "enterprise");
    } else {
      this.set("galleryState", "community");
    }
  },

  actions: {
    updateListView(listView) {
      this.set("listViewState", listView);
    },
    updateFilter(filterInput) {
      this.transitionToRoute({ queryParams: { search: filterInput } });
    },
    setGalleryState(state) {
      this.set("galleryState", state);
      let tags = state === "enterprise" ? "enterprise" : null;
      this.transitionToRoute({ queryParams: { tags } });
    },
  },
});
