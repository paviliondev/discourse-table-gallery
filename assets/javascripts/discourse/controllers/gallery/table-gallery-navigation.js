import NavigationCategoryController from "discourse/controllers/navigation/category";

// this controller manages the table-gallery-navigation template, we're initialising the variables used there
export default NavigationCategoryController.extend({
  galleryState: "community",
  listViewState: "grid",
  filterInput: "",

  actions: {
    updateListView(listView) {
      this.set("listViewState", listView);
      // this is changing, but needs to actually make the update?
    },
    updateFilter(filterInput) {
      this.transitionToRoute({ queryParams: { search: filterInput } });
    },
  },
});
