import Component from "@ember/component";

export default Component.extend({
  classNameBindings: [":gallery-state-toggle", "galleryState"],

  actions: {
    toggle(state) {
      this.setGalleryState(state);
    },
  },
});
