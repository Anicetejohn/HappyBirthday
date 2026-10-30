# Happy birthday website 💜

She opens a sealed purple envelope, then sees her name, your photos, your letter, and a cake whose candles she can blow out.

## 1. Make it yours (edit `config.js`)

Everything personal lives in **`config.js`**, so you don't need to touch the other files.

- `herName`: her name or nickname (the wax seal uses its first letter)
- `yourName`: how you sign the letter
- `togetherSince`: the date you got together, like `"2023-02-14"`, to show "___ days together" (leave `""` to hide it)
- `photos`: file names and captions
- `letter`: your letter, one paragraph per line
- `candles`: how many candles are on the cake
- `music`: optional song (see step 3)

## 2. Photos

Her six photos are already in the **`images`** folder as `photo1.jpg` … `photo6.jpg`.
To add more, put the file in `images` and add a line to `photos` in `config.js`.

Tips:
- **Spelling and capital letters must match exactly** on GitHub (`photo1.jpg` ≠ `Photo1.JPG`).
- iPhone photos in `.HEIC` format won't show in browsers. Export them as JPG first.
- Big phone photos load slowly. Resize them to about 1600px wide if you can.

## 3. Song

A music-box version of Happy Birthday is included (`music/happy-birthday.mp3`). It starts when she breaks the seal, and a small button in the corner pauses it.

To use a different song, put the `.mp3` in the **`music`** folder and change `music` in `config.js`, for example `music: "music/our-song.mp3",`.

## 4. Preview it on your computer

Double-click `index.html` to open it in your browser.

## 5. Put it on GitHub Pages

1. Go to github.com, click **New repository**, name it (for example `happy-birthday`), make it **Public**, and click **Create repository**.
2. Click **uploading an existing file**. Drag in **everything inside this folder** (`index.html`, `style.css`, `script.js`, `config.js`, and the `images`, `assets`, `music` folders). Don't upload the zip itself.
3. Click **Commit changes**.
4. Go to **Settings → Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, choose branch **main** and folder **/ (root)**, then click **Save**.
5. Wait a minute or two and refresh. Your link will be:
   `https://YOUR-USERNAME.github.io/happy-birthday/`

Note: anyone who has the link can open the site, so only use photos you're both happy with.

To change something later, edit the file on GitHub (pencil icon) or upload the new version. The site updates within a minute or two.
