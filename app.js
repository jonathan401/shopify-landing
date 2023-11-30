// dom elements
const progressBar = document.querySelector(".setup-guide__progress-marker");
const completedItems = document.querySelector("#completed-items");
const visibleCompletedItems = document.querySelector("#visible-completd-items");
const accordions = document.querySelectorAll(".accordion-content");
const accordionTriggers = document.querySelectorAll(
  ".accordion-trigger button"
);
const checkBoxes = document.querySelectorAll('button[role="checkbox"]');
const notificationBell = document.querySelector("#alert-trigger");
const storeTrigger = document.querySelector("#store-trigger");
const storeOptions = document.querySelector("#store-options");

const contents = document.querySelectorAll(".popover-container");
contents.forEach((content) =>
  content.addEventListener("click", (e) => e.stopPropagation())
);

// constants
const ANIMATION_TIMING = 250;
const HIDDEN_CLASS = "hidden";

const updateProgress = () => {
  const checkedBoxes = document.querySelectorAll(
    'button[role="checkbox"][aria-checked="true"]'
  );

  const totalCheckBoxes = document.querySelectorAll('button[role="checkbox"]');
  let percentage = checkedBoxes.length / totalCheckBoxes.length;
  completedItems.textContent = checkedBoxes.length;
  visibleCompletedItems.textContent = checkedBoxes.length;
  progressBar.style.width = `${percentage * 100}%`;
};

const setupTrigger = document.querySelector("#setup-guide-trigger");

// checkbox
const checkboxBtns = document.querySelectorAll('button[role="checkbox"]');
const stepGuide = document.querySelectorAll(".stepup-guide");
const marker = document.querySelector(".setup-guide__progress-marker");
const snackBar = document.querySelector(".snack-bar");
const snackBarDismiss = document.querySelector(".snack-bar .btn--cancel");

checkboxBtns.forEach((checkboxBtn) => {
  const defaultState = checkboxBtn.querySelector(".checkbox--state-default");
  const loadingState = checkboxBtn.querySelector(".checkbox--state-loading");
  const doneState = checkboxBtn.querySelector(".checkbox--state-done");

  checkboxBtn.addEventListener("click", (e) => {
    let isChecked = checkboxBtn.getAttribute("aria-checked") === "true";

    if (isChecked) {
      isChecked = false;
    } else {
      isChecked = true;
    }

    checkboxBtn.setAttribute("aria-checked", isChecked);

    if (isChecked) {
      defaultState.classList.add(HIDDEN_CLASS);
      loadingState.classList.remove(HIDDEN_CLASS);

      setTimeout(() => {
        loadingState.classList.add(HIDDEN_CLASS);
        doneState.classList.remove(HIDDEN_CLASS);

        // grab the next content and expand
        const unCheckedItems = Array.from(
          document.querySelectorAll('button[role="checkbox"]')
        );

        let item = unCheckedItems.find((item) => {
          return item.getAttribute("aria-checked") === "false";
        });
        if (item) {
          const unCheckedItemId = item.getAttribute("data-id");
          const unCheckedItem = document.querySelector(`#${unCheckedItemId}`);

          closeAccordions(unCheckedItem);
        }
        updateProgress();
      }, ANIMATION_TIMING);
    } else {
      doneState.classList.add(HIDDEN_CLASS);
      loadingState.classList.remove(HIDDEN_CLASS);

      setTimeout(() => {
        loadingState.classList.add(HIDDEN_CLASS);
        defaultState.classList.remove(HIDDEN_CLASS);
        doneState.classList.add(HIDDEN_CLASS);
        updateProgress();
      }, ANIMATION_TIMING);
    }
  });
});

document.addEventListener("click", (e) => {
  notificationBell.setAttribute("aria-expanded", false);
  storeTrigger.setAttribute("aria-expanded", false);
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    notificationBell.setAttribute("aria-expanded", false);
    storeTrigger.setAttribute("aria-expanded", false);
  }
});

const closeAccordions = (target) => {
  let allAccordions = Array.from(accordionTriggers);
  let filteredAccordions = allAccordions.filter((trigger) => {
    let triggerId = trigger.getAttribute("id");
    return triggerId !== target.getAttribute("id");
  });

  filteredAccordions.map((trigger) => {
    trigger.setAttribute("aria-expanded", false);
  });
  target.setAttribute("aria-expanded", true);

  // target.focus();
};

const handleEscapePress = (event, trigger) => {
  if (event.key === "Escape") {
    console.log(trigger);
    trigger.setAttribute("aria-expanded", false);
    trigger.focus();
  }
};

// event listeners
const handleNotificationClick = (event) => {
  event.stopPropagation();

  let isExpanded = notificationBell.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    isExpanded = false;
  } else {
    isExpanded = true;
  }
  notificationBell.setAttribute("aria-expanded", isExpanded);
  storeTrigger.setAttribute("aria-expanded", false);

  // add event listener to handle escape keypress
  if (isExpanded) {
    const contentId = notificationBell.getAttribute("aria-controls");
    const content = document.getElementById(contentId);
    const buttons = content.querySelectorAll("button");
    const header = content.querySelector(".alert__header-h2");

    // debug: The button element is not being focused
    content.addEventListener("keyup", (e) => {
      handleEscapePress(e, notificationBell);
    });
  }
};

const handleStoreOptionsClick = (event) => {
  event.stopPropagation();

  let isExpanded = storeTrigger.getAttribute("aria-expanded") === "true";
  notificationBell.setAttribute("aria-expanded", false);
  // grab the content it controls
  const contentId = storeTrigger.getAttribute("aria-controls");
  const content = document.getElementById(contentId);
  const menuItems = content.querySelectorAll("[role='menuitem']");

  // added timeout to the menu to trigger focus as visibility: hidden definition in css prevented this
  setTimeout(() => menuItems[0].focus(), 100);

  const handleArrowPress = (event, itemIndex) => {
    // go up or down the index
    const firstItem = 0;
    const lastItem = menuItems.length - 1;
    const nextItemIndex = itemIndex + 1;
    const previousItemIndex = itemIndex - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      // prevents page from scrolling when the user presses the arrow down or up key
      event.preventDefault();
      if (itemIndex === lastItem) {
        menuItems[0].focus();
        return;
      }
      menuItems[nextItemIndex].focus();
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      if (itemIndex === firstItem) {
        menuItems[lastItem].focus();
        return;
      }
      menuItems[previousItemIndex].focus();
    }
  };

  if (isExpanded) {
    isExpanded = false;
  } else {
    isExpanded = true;
  }
  storeTrigger.setAttribute("aria-expanded", isExpanded);
  // console.log(isExpanded);
  if (isExpanded) {
    // console.log(menuItems);
    menuItems[0].focus();
    content.addEventListener("keyup", (e) =>
      handleEscapePress(e, storeTrigger)
    );
    menuItems.forEach((item, itemIndex) => {
      item.addEventListener("keyup", (e) => {
        handleArrowPress(e, itemIndex);
      });
    });

    // prevents scrolling
    content.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
      }
    });
  }
};

// event listeners
notificationBell.addEventListener("click", handleNotificationClick);
storeTrigger.addEventListener("click", handleStoreOptionsClick);

checkBoxes.forEach((checkbox) => checkbox.addEventListener("click", (e) => {}));

accordionTriggers.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.target.setAttribute("aria-expanded", true);
    closeAccordions(e.target);
  });
});

setupTrigger.addEventListener("click", (e) => {
  let isExpanded = setupTrigger.getAttribute("aria-expanded") === "true";

  // handle aria state change here
  if (isExpanded) {
    isExpanded = false;
  } else {
    isExpanded = true;
  }

  setupTrigger.setAttribute("aria-expanded", isExpanded);
  if (isExpanded) {
    accordionTriggers[0].setAttribute("aria-expanded", true);
  }
});

snackBarDismiss.addEventListener("click", (e) => {
  snackBar.classList.add("hidden");
});
