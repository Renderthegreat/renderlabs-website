<template>
  <head>
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png">
    <link rel="manifest" href="/assets/site.webmanifest">
    <link rel="mask-icon" href="/assets/favicon/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
  </head>
  <body>
    <div id="app">
      <App></App>
    </div>
  </body>
</template>

<style>
  body {
    margin: 0px;
    padding: 0px;
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  body::-webkit-scrollbar {
    display: none;
  }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .pixelify {
    font-family: "Pixelify Sans", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  .sans-serif {
    font-family: sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  button {
    border: none;
    outline: none;
    background-color: #6c5ce7;
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 700;
    color: var(--current-color-main);
    border-radius: 5px;
    transition: all ease 0.1s;
    box-shadow: 0px 5px 0px 0px #a29bfe;
    align-self: center;
    font-family: "Pixelify Sans", sans-serif;
  }

  button:active {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px 0px #a29bfe;
  }

  button:hover {
    background-color: #9b87e6;
  }

  button:disabled {
    background-color: #b0b0b0;
    cursor: not-allowed;
  }

  input[type="text"], input[type="password"] {
    border-radius: 5px;
    border: 1px solid var(--splitter-color);
    color: var(--opposite-color-main);
    background-color: var(--current-color-main);
    padding: 10px;
  }

  input[type="checkbox"]::after {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid var(--splitter-color);
    color: var(--opposite-color-main);
    background-color: var(--current-color-main);
    padding: 10px;
  }

  a {
    color: var(--renderlabs-color);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  pre {
    background-color: var(--current-color-secondary);
    color: var(--opposite-color-secondary);
    padding: 15px;
    border-radius: 5px;
    border: 1px solid var(--current-color-tertiary);
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.5;
  }

  #app {
    margin: 0px;
    padding: 0px;
    width: 100%;
    overflow: hidden;
  }
  
  * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  *::-webkit-scrollbar {
    display: none;
  }
</style>