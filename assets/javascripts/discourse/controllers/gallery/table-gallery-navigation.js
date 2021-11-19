import NavigationCategoryController from "discourse/controllers/navigation/category";

// this controller manages the table-gallery-navigation template, we're initialising the variables used there
export default NavigationCategoryController.extend({
  galleryState: "community",
  listViewState: "grid",
  filterInput: "",

  actions: {
    updateListView(listView) {
      this.set("listViewState", listView);
    },
    updateFilter(filterInput) {
      this.transitionToRoute({ queryParams: { search: filterInput } });
    },
  },
});
