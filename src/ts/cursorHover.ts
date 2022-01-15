import isTouchDevice from "./checkTouchDevice";

const cursorHover = () => {
  const hoverElements = document.querySelectorAll(".hoverable");
  const cursor = document.getElementById("cursor") as HTMLElement;

  isTouchDevice && (cursor.style.display = "none");

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
