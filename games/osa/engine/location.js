export const location = (story) => {
  const name = story.render(null, {}, "Name");

  return {
    type: "location",
    name,
    story,
  };
};
