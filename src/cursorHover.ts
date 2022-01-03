const cursorHover = () => {
  const hoverElements = document.querySelectorAll(".hoverable");
  const cursor = document.getElementById("cursor");

  hoverElements.forEach((element) => {
    element.addEventListener("mouseover", () => {
      console.log("hovered");
      cursor.classList.add("hover");
    });

    element.addEventListener("mouseleave", () => {
      console.log("mouseleave");
      cursor.classList.remove("hover");
    });
  });
};

export default cursorHover;
