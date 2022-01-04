const stretchText = () => {
  const elements = Array.from(
    document.getElementsByClassName(
      "stretch-text"
    ) as HTMLCollectionOf<HTMLElement>
  );

  elements.forEach((element) => {
    const width = element.clientWidth;
    const charNum = element.textContent ? element.textContent.length : 0;
    const spacing = width / charNum;
    const text = element.textContent;

    const stretchSpan = document.createElement("span");
    stretchSpan.classList.add("stretch-span");
    stretchSpan.textContent = text;
    element.innerHTML = "";
    element.appendChild(stretchSpan);

    const stretchSpanWidth = stretchSpan.getBoundingClientRect().width;
    const charWidth = stretchSpanWidth / charNum;
    const letterSpacing = spacing - charWidth + (spacing - charWidth) / charNum;

    stretchSpan.style.letterSpacing = `${letterSpacing + 3.5}px`;
  });
};

export default stretchText;
