const reasons = document.querySelectorAll(
  ".reason-1, .reason-2, .reason-3, .reason-4, .reason-5, .reason-6"
);

const states = new Map();

reasons.forEach((reason) => {
  states.set(reason, {
    x: window.innerWidth,
    opacity: 0
  });
});

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function animateReasons() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  reasons.forEach((reason) => {
    const rect = reason.getBoundingClientRect();
    const state = states.get(reason);

    const center = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;

    // Smoothly approach the center: entering and exiting both glide sideways.
    const distanceFromCenter = center - viewportCenter;
    const glideRange = viewportHeight * 0.75;
    const centerProgress = clamp(1 - Math.abs(distanceFromCenter) / glideRange, 0, 1);

    const entering = distanceFromCenter > 0;
    const targetX = entering
      ? (1 - centerProgress) * viewportWidth
      : -(1 - centerProgress) * viewportWidth;

    // Fade in near the center and fade out as the box leaves.
    const entryProgress = clamp((viewportHeight - rect.top) / (viewportHeight * 0.35), 0, 1);
    const exitProgress = clamp(rect.bottom / (viewportHeight * 0.35), 0, 1);
    const targetOpacity = entryProgress * exitProgress;

    // Direct interpolation has no overshoot or bounce.
    state.x += (targetX - state.x) * 0.045;
    state.opacity += (targetOpacity - state.opacity) * 0.055;

    reason.style.opacity = state.opacity;
    reason.style.transform =
      `translate(-50%, -50%) translateX(${state.x}px)`;
  });

  requestAnimationFrame(animateReasons);
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

window.scrollTo(0, 0);

animateReasons();
