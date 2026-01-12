# Streaming Markdown Parser

Hey! This is my streaming markdown parser project. I built this for a coding assignment where I had to create a parser that processes markdown text as it streams in, kinda like how ChatGPT shows text appearing character by character.

## What It Does

- **Inline code** - The `backtick stuff` that shows up with gray background
- **Code blocks** - The ```triple backtick blocks``` with nice formatting
- **Smart parsing** - It immediately styles when it sees the start markers 
- **Token splitting** - Handles when markdown markers get split across different chunks
- **Text selection** - You can still select and copy text while it's streaming

### Features I Added 
- **Headings** - # ## ### turn into proper H1, H2, H3 tags
- **Bold text** - **double stars** make text bold
- **Italic text** - *single stars* make text italic

## RUN Command

### 
```bash
npm install
```

### Build 
```bash
npx tsc
copy public\index.html dist\
```

### Test
```bash
cd dist
python -m http.server 8000
# Open http://localhost:8000
# Hit the "STREAM" button!
```
