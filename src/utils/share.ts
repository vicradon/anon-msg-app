export const share = (url: string) => {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url,
    });
  } else {
    // copy to clipboard
  }
};
