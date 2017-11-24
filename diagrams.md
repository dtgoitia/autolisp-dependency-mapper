# Remove comments

This flowchart shows the basic logic behind the parsing:

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