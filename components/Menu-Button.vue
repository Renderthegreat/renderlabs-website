<template>
  <button class="btn">
    <span class="text"><slot></slot></span>
  </button>
</template>

<style scoped>
  .btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 1em 2em;
    font-size: 15px;
    font-weight: bold;
    border-width: 0;
    text-transform: uppercase;
    transition: .2s ease;
  }

  .text {
    font-size: 1.2em;
    color: white;
    z-index: 1;
  }

  .btn::before {
    position: absolute;
    content: '';
    width: 120%;
    height: 260%;
    background-image: linear-gradient(135deg, rgba(0,5,255,1) 0%, rgba(255,0,159,1) 100%);
  }

  .btn:hover.btn {
    transform: scale(1.1);
  }

  .btn:hover.btn::after {
    opacity: .5;
  }

  .btn:hover.btn::before {
    animation: turn_4810 .4s infinite linear;
  }

  .btn:active.btn {
    transform: scale(1.05);
  }

  .btn:active.btn::before {
    transform: scale(1.05);
    animation: turn_4810 .2s infinite linear;
  }

  @keyframes turn_4810 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }


</style>