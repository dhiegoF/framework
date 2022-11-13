export default [
  {
    prefix: "bg",
    prefixReplace: "background-color",
    minProps: 1,
    maxProps: 2,
    props: {
      red: {
        prefix: "blue",
        prefixReplace: "",
        "500": "red"
      },

      blue: {
        prefix: "blue",
        prefixReplace: "",
        "500": "blue"
      }
    }
  },

  {
    prefix: "width",
    prefixReplace: "width",
    minProps: 1,
    maxProps: 2,
    props: {
      pre: {
        prefix: "blue",
        prefixReplace: "",
        "1": "1rem",
        "2": "2rem"
      }
    }
  }
]