/* ==========================================================
   EDIT THIS FILE to personalise the website.
   You only need to change the text between the quotes.
   ========================================================== */

window.CONFIG = {
  // Her name, shown big on the first screen and on the envelope.
  // The wax seal uses its first letter.
  herName: "Cyrine Jasa Castor",

  // Your name, used to sign the letter and in the footer.
  yourName: "John Paul",

  // The date you got together (YYYY-MM-DD) to show "___ days together".
  // Leave it as "" to hide that line. Example: "2023-02-14"
  togetherSince: "",

  // The short line under her name.
  heroLine: "Today is all about you, and I made this just for you.",

  // Your photos. Put the image files in the "images" folder,
  // then list them here. Add or remove lines as you like.
  // File names must match exactly (photo1.jpg is not the same as Photo1.JPG).
  // "position" (optional) moves the crop in the small polaroid,
  // e.g. "70% 50%" shows more of the right side.
  photos: [
    { src: "images/photo1.jpg", caption: "Ang ganda mo dito, sobra" },
    { src: "images/photo2.jpg", caption: "Main character" },
    { src: "images/photo3.jpg", caption: "Future teacher ko" },
    { src: "images/photo4.jpg", caption: "Tampo face, pero cute pa rin", position: "62% 50%" },
    { src: "images/photo5.jpg", caption: "Caught you, photographer ko" },
    { src: "images/photo6.jpg", caption: "Pa-cute pa more" },
  ],

  // Your letter. Each item in "paragraphs" is one paragraph.
  letter: {
    greeting: "Happy birthday love love,",
    paragraphs: [
      "Twenty kana wala kanang TEEN, matanda kana rin katulad ko pero ako parin baby mo.",
      "Enjoyin mo araw mo kase its your birthday, hindi man big deal sayo pero sakin big deal kaya cecelebrate natin yan ng kasama ako.",
      "I Love You.",
    ],
    closing: "Nagmamahal,",
  },

  // How many candles on the cake (1 to 9).
  candles: 5,

  // Shown after she blows out all the candles.
  wishMessage: "I hope every single wish comes true.",

  // Background music. It starts when she breaks the seal.
  // To use a different song, put the .mp3 in the "music" folder
  // and change the path. Leave as "" for no music.
  music: "music/happy-birthday.mp3",
};
