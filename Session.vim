let SessionLoad = 1
if &cp | set nocp | endif
let s:cpo_save=&cpo
set cpo&vim
inoremap <silent> <expr> <Plug>_ "\=deoplete#mapping#_complete()\"
inoremap <silent> <C-Tab> =UltiSnips#ListSnippets()
imap <Down> <Down>
imap <Up> <Up>
xmap  <Plug>SpeedDatingUp
nmap  <Plug>SpeedDatingUp
snoremap <silent>  c
nnoremap  h
xnoremap <silent> <NL> :call UltiSnips#SaveLastVisualSelection()gvs
snoremap <silent> <NL> :call UltiSnips#ExpandSnippetOrJump()
nnoremap <NL> j
nnoremap  k
nnoremap  l
nnoremap <silent>  :noh
snoremap  "_c
xmap  <Plug>SpeedDatingDown
nmap  <Plug>SpeedDatingDown
nnoremap   za
map Q q
xmap S <Plug>VSurround
nmap \caL <Plug>CalendarH
nmap \cal <Plug>CalendarV
nmap <silent> \ig <Plug>IndentGuidesToggle
nnoremap \g :YcmCompleter GoTo
nmap cS <Plug>CSurround
nmap cs <Plug>Csurround
nmap d <Plug>SpeedDatingNowLocal
nmap d <Plug>SpeedDatingNowUTC
nmap ds <Plug>Dsurround
vmap gx <Plug>NetrwBrowseXVis
nmap gx <Plug>NetrwBrowseX
xmap gS <Plug>VgSurround
nmap gC <Plug>CapsLockToggle
nmap ySS <Plug>YSsurround
nmap ySs <Plug>YSsurround
nmap yss <Plug>Yssurround
nmap yS <Plug>YSurround
nmap ys <Plug>Ysurround
vnoremap <silent> <Plug>NetrwBrowseXVis :call netrw#BrowseXVis()
nnoremap <silent> <Plug>NetrwBrowseX :call netrw#BrowseX(expand((exists("g:netrw_gx")? g:netrw_gx : '<cfile>')),netrw#CheckIfRemote())
nnoremap <silent> <Plug>CalendarT :cal calendar#show(2)
nnoremap <silent> <Plug>CalendarH :cal calendar#show(1)
nnoremap <silent> <Plug>CalendarV :cal calendar#show(0)
nnoremap <Plug>SpeedDatingFallbackDown 
nnoremap <Plug>SpeedDatingFallbackUp 
nnoremap <silent> <Plug>SpeedDatingNowUTC :call speeddating#timestamp(1,v:count)
nnoremap <silent> <Plug>SpeedDatingNowLocal :call speeddating#timestamp(0,v:count)
vnoremap <silent> <Plug>SpeedDatingDown :call speeddating#incrementvisual(-v:count1)
vnoremap <silent> <Plug>SpeedDatingUp :call speeddating#incrementvisual(v:count1)
nnoremap <silent> <Plug>SpeedDatingDown :call speeddating#increment(-v:count1)
nnoremap <silent> <Plug>SpeedDatingUp :call speeddating#increment(v:count1)
nnoremap <silent> <Plug>SurroundRepeat .
snoremap <silent> <Del> c
snoremap <silent> <BS> c
snoremap <silent> <C-Tab> :call UltiSnips#ListSnippets()
map <F8> :!clear; java -ea -cp ../algs4.jar:. %:r
map <F7> :!clear; javac -cp ../algs4.jar:. %
nnoremap <C-Right> l
nnoremap <C-Up> k
nnoremap <C-Down> j
nnoremap <C-Left> h
map <Right> <Nop>
map <Left> <Nop>
map <Down> <Nop>
map <Up> <Nop>
imap  
imap S <Plug>ISurround
imap s <Plug>Isurround
imap c <Plug>CapsLockToggle
inoremap <expr> 	 pumvisible() ? "\" : "\	"
inoremap <silent> <NL> =UltiSnips#ExpandSnippetOrJump()
imap  <Plug>CapsLockToggle
imap  <Plug>Isurround
inoremap  u
cmap w!! w !sudo tee %
iabbr <expr> dts strftime("%Y-%m-%d %T %z")
let &cpo=s:cpo_save
unlet s:cpo_save
set autoindent
set autoread
set autowriteall
set background=dark
set backspace=indent,eol,start
set backup
set backupdir=~/.vim/backup//
set balloonexpr=eclim#util#Balloon(eclim#util#GetLineError(line('.')))
set clipboard=unnamed,unnamedplus
set completeopt=longest,menuone,preview
set directory=~/.vim/swap//
set expandtab
set fileencodings=ucs-bom,utf-8,default,latin1
set formatoptions=tcqj
set grepformat=%f:%l:%c:%m
set grepprg=ag\ --vimgrep\ $*
set helplang=en
set hidden
set history=10000
set hlsearch
set ignorecase
set incsearch
set langnoremap
set nolangremap
set laststatus=2
set listchars=tab:â€º\ ,trail:âˆ™,nbsp:â€ ,extends:Â»,precedes:Â«
set mouse=a
set nrformats=bin,hex
set pastetoggle=<F12>
set path=.,/usr/include,,,**
set printoptions=formfeed:y
set runtimepath=~/.vim,~/.vim/bundle/vim-colors-solarized/,~/.vim/bundle/vim-polyglot/,~/.vim/bundle/vim-airline/,~/.vim/bundle/vim-airline-themes/,~/.vim/bundle/vim-indent-guides/,~/.vim/bundle/tern_for_vim/,~/.vim/bundle/ultisnips/,~/.vim/bundle/vim-snippets/,~/.vim/bundle/neomake/,~/.vim/bundle/numbers.vim/,~/.vim/bundle/vim-capslock/,~/.vim/bundle/vim-surround/,~/.vim/bundle/vim-repeat/,~/.vim/bundle/vim-css-color/,~/.vim/bundle/vim-mustache-handlebars/,~/.vim/bundle/tagbar/,~/.vim/bundle/vim-speeddating/,~/.vim/bundle/calendar-vim/,~/.vim/bundle/deoplete.nvim/,~/.vim/bundle/nvim-yarp/,~/.vim/bundle/vim-hug-neovim-rpc/,~/.vim/bundle/deoplete-ternjs/,~/.vim/pack/plugins/start/vim-go,/usr/local/share/vim/vimfiles,/usr/local/share/vim/vim81,/usr/local/share/vim/vimfiles/after,~/.vim/eclim,~/.vim/eclim/after,~/.vim/bundle/vim-polyglot/after,~/.vim/bundle/tern_for_vim/after,~/.vim/bundle/ultisnips/after,~/.vim/bundle/vim-css-color/after,~/.vim/after
set scrolloff=2
set sessionoptions=blank,buffers,curdir,folds,help,options,tabpages,winsize,terminal,blank,buffers,curdir,folds,help,tabpages,winsize
set shiftwidth=2
set showcmd
set showmatch
set noshowmode
set showtabline=2
set smartcase
set smarttab
set softtabstop=2
set splitbelow
set splitright
set tabline=%!airline#extensions#tabline#get()
set tabstop=2
set tags=./tags,./TAGS,tags,TAGS,./tags;,tags
set undodir=~/.vim/undo//
set undofile
set viewoptions=folds,options,cursor,unix,slash
set viminfo='1000,f1,<500,n~/.vim/viminfo
set virtualedit=onemore
set whichwrap=b,s,h,l,<,>,[,]
set wildignore=.hg,.git,.svn,*.jpg,*.bmp,*.gif,*.png,*.jpeg,*.o,*.obj,*.exe,*.dll,*.manifest,*.spl,*.sw?,*.DS_Store,*.luac,*.pyc,*.class
set wildmenu
set wildmode=list:longest,full
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd /mnt/projects/ethereum/learn/consensys_academy/final_project
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +139 src/js/app.js
badd +1 src/index.html
badd +22 contracts/StakePool.sol
argglobal
silent! argdel *
edit src/js/app.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 94 + 95) / 190)
exe 'vert 2resize ' . ((&columns * 95 + 95) / 190)
argglobal
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal backupcopy=
setlocal balloonexpr=
setlocal nobinary
setlocal nobreakindent
setlocal breakindentopt=
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
set colorcolumn=80
setlocal colorcolumn=80
setlocal comments=sO:*\ -,mO:*\ \ ,exO:*/,s1:/*,mb:*,ex:*/,://
setlocal commentstring=//%s
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
set cursorline
setlocal cursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript.jsx'
setlocal filetype=javascript.jsx
endif
setlocal fixendofline
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
set foldlevel=99
setlocal foldlevel=99
setlocal foldmarker={{{,}}}
set foldmethod=syntax
setlocal foldmethod=syntax
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=jcroql
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal formatprg=
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=-1
setlocal include=
setlocal includeexpr=
setlocal indentexpr=GetJsxIndent()
setlocal indentkeys=0{,0},0),0],0,,!^F,o,O,e,*<Return>,<>>,<<>,/
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal lispwords=
set list
setlocal list
setlocal makeencoding=
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=bin,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=tern#Complete
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal signcolumn=auto
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!airline#statusline(1)
setlocal suffixesadd=.js,.jsx
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'javascript.jsx'
setlocal syntax=javascript.jsx
endif
setlocal tabstop=2
setlocal tagcase=
setlocal tags=
setlocal termwinkey=
setlocal termwinscroll=10000
setlocal termwinsize=
setlocal textwidth=0
setlocal thesaurus=
setlocal undofile
setlocal undolevels=-123456
setlocal varsofttabstop=
setlocal vartabstop=
setlocal nowinfixheight
setlocal nowinfixwidth
set nowrap
setlocal nowrap
setlocal wrapmargin=0
3
normal! zo
12
normal! zo
17
normal! zo
19
normal! zo
40
normal! zo
42
normal! zo
42
normal! zo
52
normal! zo
60
normal! zo
64
normal! zo
64
normal! zo
93
normal! zo
94
normal! zo
106
normal! zo
110
normal! zo
113
normal! zo
116
normal! zo
125
normal! zo
126
normal! zo
17
normal! zo
19
normal! zo
40
normal! zo
42
normal! zo
42
normal! zo
53
normal! zo
61
normal! zo
65
normal! zo
65
normal! zo
94
normal! zo
95
normal! zo
107
normal! zo
111
normal! zo
114
normal! zo
117
normal! zo
126
normal! zo
127
normal! zo
139
normal! zo
140
normal! zo
141
normal! zo
155
normal! zo
159
normal! zo
168
normal! zo
53
normal! zo
61
normal! zo
65
normal! zo
65
normal! zo
94
normal! zo
95
normal! zo
107
normal! zo
111
normal! zo
114
normal! zo
117
normal! zo
126
normal! zo
127
normal! zo
139
normal! zo
140
normal! zo
141
normal! zo
155
normal! zo
159
normal! zo
168
normal! zo
let s:l = 51 - ((24 * winheight(0) + 25) / 51)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
51
normal! 024|
wincmd w
argglobal
if bufexists('src/index.html') | buffer src/index.html | else | edit src/index.html | endif
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal backupcopy=
setlocal balloonexpr=
setlocal nobinary
setlocal nobreakindent
setlocal breakindentopt=
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
set colorcolumn=80
setlocal colorcolumn=80
setlocal comments=s:<!--,m:\ \ \ \ ,e:-->
setlocal commentstring=<!--%s-->
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
set cursorline
setlocal cursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'html'
setlocal filetype=html
endif
setlocal fixendofline
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
set foldlevel=99
setlocal foldlevel=99
setlocal foldmarker={{{,}}}
set foldmethod=syntax
setlocal foldmethod=syntax
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcqj
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal formatprg=
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=-1
setlocal include=
setlocal includeexpr=
setlocal indentexpr=GetCoffeeHtmlIndent(v:lnum)
setlocal indentkeys=o,O,<Return>,<>>,{,},!^F
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal lispwords=
set list
setlocal list
setlocal makeencoding=
setlocal makeprg=
setlocal matchpairs=(:),{:},[:],<:>
setlocal modeline
setlocal modifiable
setlocal nrformats=bin,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=htmlcomplete#CompleteTags
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
set relativenumber
setlocal relativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=2
setlocal noshortname
setlocal signcolumn=auto
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!airline#statusline(2)
setlocal suffixesadd=
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'html'
setlocal syntax=html
endif
setlocal tabstop=2
setlocal tagcase=
setlocal tags=
setlocal termwinkey=
setlocal termwinscroll=10000
setlocal termwinsize=
setlocal textwidth=0
setlocal thesaurus=
setlocal undofile
setlocal undolevels=-123456
setlocal varsofttabstop=
setlocal vartabstop=
setlocal nowinfixheight
setlocal nowinfixwidth
set nowrap
setlocal nowrap
setlocal wrapmargin=0
let s:l = 73 - ((39 * winheight(0) + 25) / 51)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
73
normal! 015|
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 94 + 95) / 190)
exe 'vert 2resize ' . ((&columns * 95 + 95) / 190)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToO
set winminheight=1 winminwidth=1
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
