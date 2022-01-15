const cycleSkills = () => {
  const skills = ["Typescript", "React", "Next.js", "Three.js"];
  const skillStore = { nextSkill: skills[0], skill: "Curiosity" };
  let cycle = 0;
  const intervalLength = 1000;

  const worksButton = document.getElementById("works");
  const firstLine = document.getElementById("firstLine");
  const github = document.getElementById("Github");

  const handleFades = () => {
    const prevSkillElement = document.getElementById(skillStore.skill);
    const skillElement = document.getElementById(skillStore.nextSkill);

    prevSkillElement?.classList.remove("fade-in");
    prevSkillElement?.classList.add("fade-out");
    skillElement?.classList.remove("fade-out");
    skillElement?.classList.add("fade-in");
  };

  worksButton?.addEventListener("click", () => {
    const intervalID = setInterval(() => {
      cycle += 1;

      handleFades();
      if (cycle <= skills.length) {
        firstLine && (firstLine.innerHTML = "Developing Websites with");
        github && (github.style.zIndex = "1");
        skillStore.skill = skillStore.nextSkill;
        skillStore.nextSkill = skills[cycle - 1];
      }

      if (cycle === skills.length + 1) {
        skillStore.skill = skillStore.nextSkill;
        skillStore.nextSkill = "Github";
      }

      if (cycle === skills.length + 2) {
        skillStore.skill = "Github";
        skillStore.nextSkill = "Curiosity";
        github && (github.style.zIndex = "5");
        firstLine &&
          (firstLine.innerText =
            "To see what I've been up to, have a look at my");
        cycle = 0;
        clearInterval(intervalID);
      }
    }, intervalLength);
  });
};

export default cycleSkills;
