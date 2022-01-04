const cursorHover = () => {
  const hoverElements = document.querySelectorAll(".hoverable");
  const cursor = document.getElementById("cursor") as HTMLElement;

  hoverElements.forEach((element) => {
    element.addEventListener("mouseover", () => {
      cursor.classList.add("hover");
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
    });
  });
};

export default cursorHover;
