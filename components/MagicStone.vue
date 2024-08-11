<template>
  <div id="magic-stone">
    <span id="magic-stone-jade">
      <span class="magic-stone-jade-line"></span>
      <span class="magic-stone-jade-line"></span>
      <span class="magic-stone-jade-line"></span>
      <span class="magic-stone-jade-line"></span>
      <span class="magic-stone-jade-line"></span>
      <span class="magic-stone-jade-line"></span>
      <span class="magic-stone-jade-line"></span>
      <span class="magic-stone-jade-line"></span>
    </span>
    <div id="magic-stone-jade-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style scoped>
  #magic-stone {
    display: inline-flex;
    flex-direction: column;
    top: 0;
    left: 0;
    width: 100%;
    position: relative;
    padding: 30px;
    margin: 0;
    border-radius: 10px;
    background-image: var(--stone-gradient);
    color: var(--light-color-main)
  }

  #magic-stone-jade {
    width: 100%;
    height: 100%;
  }

  #magic-stone-jade-content {
    z-index: 1;
  }

  .magic-stone-jade-line::before,
  .magic-stone-jade-line::after {
    content: "";
    position: absolute;
    width: 100%;
    color: var(--stone-accent-color);
    animation: magic-stone-jade-pulse 1s ease-in-out infinite;
    z-index: 0;
  }

  .magic-stone-jade-line:nth-child(1)::before {
    width: 3%;
    height: 100%;
    top: 0%;
    left: 10%;
  }
  .magic-stone-jade-line:nth-child(2)::before {
    width: 3%;
    height: 90%;
    top: 20%;
    left: 20%;
    transform: rotate(90deg);
  }

  .magic-stone-jade-line:nth-child(3)::before {
    width: 3%;
    height: 71%;
    top: 0%;
    left: 30%;
  }

  .magic-stone-jade-line:nth-child(4)::before {
    width: 3%;
    height: 29%;
    bottom: 0%;
    left: 25%;
  }

  .magic-stone-jade-line:nth-child(5)::before {
    width: 3%;
    height: 90%;
    top: 0%;
    left: 0%;
    transform: rotate(90deg);
  }

  .magic-stone-jade-line:nth-child(6)::before {
    width: 3%;
    height: 90%;
    top: -10%;
    left: 40%;
    transform: rotate(90deg);
  }

  .magic-stone-jade-line:nth-child(7)::before {
    width: 3%;
    height: 90%;
    top: 0%;
    left: 50%;
  }
</style>