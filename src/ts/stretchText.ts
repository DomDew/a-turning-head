const stretchText = () => {
  const elements = Array.from(
    document.getElementsByClassName(
      "stretch-text"
    ) as HTMLCollectionOf<HTMLElement>
  );

  elements.forEach((element) => {
    const wordsArray = element.innerText
      .split("")
      .map((e) => (" " == e ? "<div>&nbsp</div>" : "<div>" + e + "</div>"));
    element.innerHTML = wordsArray.join("");
  });
};

export default stretchText;
