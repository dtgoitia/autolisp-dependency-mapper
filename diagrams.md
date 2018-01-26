# Remove comments

This flowchart shows the basic logic behind the parsing.

Based on current state:


```mermaid
graph LR
chartStart( ? ) --> 1{quoted<br>string}

%% within a quoted string
1 -- T --> 1t{double<br>quote}
  1t -- T --> 1tt{"prevChar = <b>\</b>"}
  1tt -- T --> 1ttt[add to buffer]
  1tt -- F --> 1ttf[isQuotedString = false<br>add to buffer]
  1t -- F --> 1tf[add to buffer]

1 -- F --> 2{cmt}

%% within a comment
2 -- T --> 2t{block<br>cmt}
  
  %% closing block comment?
  2t -- T --> 2tt{"<b>;</b>"}
    2tt -- T --> 2ttt{"prevChar = <b>|</b>"}
      2ttt -- T --> 2tttt[isComment = F<br>isBlockComment = F<br>do nothing]
      2ttt -- F --> 2tttf[do nothing]
    2tt -- F --> 2ttf[do nothing]

  %% closing a line comment?
  2t -- F --> 2tf{"<b>\n</b>"}
    2tf -- T --> 2tft[isComment = F<br>do nothing]

  2tf -- F --> 2tff{"<b>|</b>"}

    2tff -- T --> 2tfft{"prevChar = <b>;</b>"}
      2tfft -- T --> 2tfftt[isBlockComment = T<br>do nothing]
      2tfft -- F --> 2tfftf[do nothing]
    2tff -- F --> 2tfff[do nothing]

%% is it " ?
2 -- F --> 3{double<br>quote}
3 -- T --> 3t[isQuotedString = T<br>add to buffer]

%% is it ; ?
3 -- F --> 4{"<b>;</b>"}
4 -- T --> 4t[isComment = T<br>do nothing]
4 -- F --> 4f[add to buffer]

```

Based on character:

```mermaid
graph LR
  chartStart(  ) --> 1{double<br>quote}
  1 -- T --> 1t{line<br>cmt}
  1t -- T --> 1tt[do nothing]
  1t -- F --> 112{quoted<br>string}

  112 -- T --> 11211[add to buffer]
  112 -- F --> 1121[isQuotedString = !isQuotedString]
  1121 --> 11211

  1 -- F --> 1f{quoted<br>string}
  1f -- T --> 1211[add to buffer]
  1f -- F --> 4{"<b>;</b>"}

  4 -- T --> 4t{line<br>cmt}
  4t -- T --> 5{block<br>cmt}
  4t -- F --> 4tt[isLineComment = T<br>do nothing]
    %% start a comment

  5 -- T --> 5t{"prevChar = <b>|</b>"}
  5 -- F --> 5f[do nothing]
  5t -- T --> 5tt[isBlockComment = F<br>do nothing]
  5t -- F --> 5tf[do nothing]
  
  4 -- F --> 4f{"<b>|</b>"}
  4f -- T --> 9{line<br>cmt}
  9 -- T --> 9t{block<br>cmt}
  9t -- T --> 10[do nothing]
  9t -- F --> 11{"prevChar = <b>;</b>"}
  9 -- F --> 9f[do nothing]
  11 -- T --> 11t[isBlockComment = T<br>do nothing]
  11 -- F --> 11f[do nothing]

  4f -- F --> 13{line<br>cmt}
  13 -- T --> 13t[do nothing]
  13 -- F --> 13f[add to buffer]

```

Notes:
* `cmt` = comment
* `T` = true
* `F` = false
* `isQuotedString`: does the current character belong a to a quoted string?
  * `A` character belongs to a quoted string (`isQuotedStrig = true`)
  * `B` character belongs to a quoted string (`isQuotedStrig = false`)
  ```
  (princ "\nA")(B xxx xxx)
  ```