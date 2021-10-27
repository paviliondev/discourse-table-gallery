import Component from "@ember/component";

export default Component.extend({
  actions: {
    filterGallery(filterInput) {
      this.updateFilter(filterInput);
    },
    enableListView() {
      this.updateListView("none");
    },
    enableGridView() {
      this.updateListView("grid");
    },
  },
});
