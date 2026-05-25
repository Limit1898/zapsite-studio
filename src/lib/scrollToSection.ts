export const scrollToSection = (id: string, onAfterScroll?: () => void) => {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }

  onAfterScroll?.();
};