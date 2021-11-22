import Component from "@ember/component";

export default Component.extend({
  classNameBindings: [":gallery-state-toggle", "galleryState"], //

  // @discourseComputed('galleryState')
  // communityToggleClass(galleryState) {
  //   return galleryState === 'community' ? 'active' : '';
  // },

  actions: {
    toggle(state) {
      this.set("galleryState", state);
      // this.transitionToRoute({ queryParams: { tags: state } }); // transitionToRoute is available on controller only
    },
  },
});
