Start
  = _ stmts:StatementList _ {
      return {
        type: "program",
        body: stmts
      };
    }

StatementList
  = stmts:(StatementEntry*) {
      return stmts;
    }

StatementEntry
  = StatementWithSemicolon
  / StatementWithoutSemicolon

StatementWithSemicolon
  = _ s:(Command / Wait) _ ";" {
      return s;
    }

StatementWithoutSemicolon
  = _ s:(Define / SequenceBlock / ParallelBlock / RepeatBlock) _ {
      return s;
    }

Statement
  = Define
  / Block
  / Wait

Define
  = "define" __ name:Identifier _ "=" _ "{" _ body:StatementList _ "}" {
      return { type: "define", name, body };
    }

Block
  = SequenceBlock
  / ParallelBlock
  / RepeatBlock
  / Command

SequenceBlock
  = "sequence" _ "{" _ cmds:StatementList _ "}" {
      return { type: "sequence", children: cmds };
    }

ParallelBlock
  = "parallel" _ "{" _ cmds:StatementList _ "}" {
      return { type: "parallel", children: cmds };
    }

RepeatBlock
  = "repeat" _ "(" _ count:Integer _ ")" _ "{" _ cmds:StatementList _ "}" {
      return { type: "repeat", count: parseInt(count, 10), children: cmds };
    }

Wait
  = "wait" __ duration:DurationLiteral {
      return { type: "wait", duration };
    }

Command
  = name:Identifier _ "(" _ arg:Argument? _ ")" {
      return { type: "command", name, arg: arg ?? null };
    }

Identifier
  = head:[a-zA-Z_] tail:[a-zA-Z0-9_]* {
      return head + tail.join("");
    }

Argument
  = chars:[a-zA-Z0-9_.-]+ {
      return chars.join("");
    }

Integer
  = digits:[0-9]+ {
      return digits.join("");
    }

DurationLiteral
  = n:[0-9]+ unit:("ms" / "s")? {
      return {
        type: "duration",
        value: parseInt(n.join(""), 10),
        unit: unit ?? "ms"
      };
    }

_  = [ \t\r\n]*
__ = [ \t\r\n]+
