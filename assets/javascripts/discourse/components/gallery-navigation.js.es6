import Component from "@ember/component";

export default Component.extend({
  actions: {
    filterGallery(filterInput) {
      console.log(filterInput);
      this.updateFilter(filterInput);
    },
    enableListView() {
      this.updateListView("list");
    },
    enableGridView() {
      this.updateListView("grid");
    },
  },
});
