const cycleSkills = () => {
  const skills = ["Typescript", "React", "Next.js", "Three.js"];
  const skillStore = { skill: skills[0], prevSkill: "Curiosity" };
  let cycle = 0;
  const intervalLength = 1000;

  const worksButton = document.getElementById("works");

  const handleFades = () => {
    const prevSkillElement = document.getElementById(skillStore.prevSkill);
    const skillElement = document.getElementById(skillStore.skill);

    console.log(skillStore);

    prevSkillElement?.classList.remove("fade-in");
    prevSkillElement?.classList.add("fade-out");
    skillElement?.classList.remove("fade-out");
    skillElement?.classList.add("fade-in");
  };

  worksButton?.addEventListener("click", () => {
    const intervalID = setInterval(() => {
      cycle += 1;

      // First Line Text ändern wenn skill === "Github"
      handleFades();
      if (cycle <= skills.length) {
        skillStore.prevSkill = skillStore.skill;
        skillStore.skill = skills[cycle - 1];
      }

      if (cycle === skills.length + 1) {
        skillStore.prevSkill = skillStore.skill;
        skillStore.skill = "Github";
      }

      if (cycle === skills.length + 2) {
        skillStore.prevSkill = "Github";
        skillStore.skill = "Curiosity";
        cycle = 0;
        clearInterval(intervalID);
      }
    }, intervalLength);
  });
};

export default cycleSkills;
