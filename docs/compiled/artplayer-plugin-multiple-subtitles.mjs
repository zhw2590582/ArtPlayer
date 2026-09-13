/*!
 * artplayer-plugin-multiple-subtitles.js v1.2.0
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 *
 * This package includes WebVTT parser and serializer code from w3c/webvtt.js.
 * Reference revision: 380cfcce34ba8b472d3a31474874eb72a0e5f460
 * https://github.com/w3c/webvtt.js/tree/380cfcce34ba8b472d3a31474874eb72a0e5f460
 * The parser has a CC0 public-domain dedication. Local adaptations replace
 * the IIFE/global exports with named ESM exports and format the code.
 * The ArtPlayer plugin wrapper remains MIT licensed.
 *
 * ## creative commons
 *
 * # CC0 1.0 Universal
 *
 * CREATIVE COMMONS CORPORATION IS NOT A LAW FIRM AND DOES NOT PROVIDE LEGAL SERVICES. DISTRIBUTION OF THIS DOCUMENT DOES NOT CREATE AN ATTORNEY-CLIENT RELATIONSHIP. CREATIVE COMMONS PROVIDES THIS INFORMATION ON AN "AS-IS" BASIS. CREATIVE COMMONS MAKES NO WARRANTIES REGARDING THE USE OF THIS DOCUMENT OR THE INFORMATION OR WORKS PROVIDED HEREUNDER, AND DISCLAIMS LIABILITY FOR DAMAGES RESULTING FROM THE USE OF THIS DOCUMENT OR THE INFORMATION OR WORKS PROVIDED HEREUNDER.
 *
 * ### Statement of Purpose
 *
 * The laws of most jurisdictions throughout the world automatically confer exclusive Copyright and Related Rights (defined below) upon the creator and subsequent owner(s) (each and all, an "owner") of an original work of authorship and/or a database (each, a "Work").
 *
 * Certain owners wish to permanently relinquish those rights to a Work for the purpose of contributing to a commons of creative, cultural and scientific works ("Commons") that the public can reliably and without fear of later claims of infringement build upon, modify, incorporate in other works, reuse and redistribute as freely as possible in any form whatsoever and for any purposes, including without limitation commercial purposes. These owners may contribute to the Commons to promote the ideal of a free culture and the further production of creative, cultural and scientific works, or to gain reputation or greater distribution for their Work in part through the use and efforts of others.
 *
 * For these and/or other purposes and motivations, and without any expectation of additional consideration or compensation, the person associating CC0 with a Work (the "Affirmer"), to the extent that he or she is an owner of Copyright and Related Rights in the Work, voluntarily elects to apply CC0 to the Work and publicly distribute the Work under its terms, with knowledge of his or her Copyright and Related Rights in the Work and the meaning and intended legal effect of CC0 on those rights.
 *
 * 1. __Copyright and Related Rights.__ A Work made available under CC0 may be protected by copyright and related or neighboring rights ("Copyright and Related Rights"). Copyright and Related Rights include, but are not limited to, the following:
 *
 *     i. the right to reproduce, adapt, distribute, perform, display, communicate, and translate a Work;
 *
 *     ii. moral rights retained by the original author(s) and/or performer(s);
 *
 *     iii. publicity and privacy rights pertaining to a person's image or likeness depicted in a Work;
 *
 *     iv. rights protecting against unfair competition in regards to a Work, subject to the limitations in paragraph 4(a), below;
 *
 *     v. rights protecting the extraction, dissemination, use and reuse of data in a Work;
 *
 *     vi. database rights (such as those arising under Directive 96/9/EC of the European Parliament and of the Council of 11 March 1996 on the legal protection of databases, and under any national implementation thereof, including any amended or successor version of such directive); and
 *
 *     vii. other similar, equivalent or corresponding rights throughout the world based on applicable law or treaty, and any national implementations thereof.
 *
 * 2. __Waiver.__ To the greatest extent permitted by, but not in contravention of, applicable law, Affirmer hereby overtly, fully, permanently, irrevocably and unconditionally waives, abandons, and surrenders all of Affirmer's Copyright and Related Rights and associated claims and causes of action, whether now known or unknown (including existing as well as future claims and causes of action), in the Work (i) in all territories worldwide, (ii) for the maximum duration provided by applicable law or treaty (including future time extensions), (iii) in any current or future medium and for any number of copies, and (iv) for any purpose whatsoever, including without limitation commercial, advertising or promotional purposes (the "Waiver"). Affirmer makes the Waiver for the benefit of each member of the public at large and to the detriment of Affirmer's heirs and successors, fully intending that such Waiver shall not be subject to revocation, rescission, cancellation, termination, or any other legal or equitable action to disrupt the quiet enjoyment of the Work by the public as contemplated by Affirmer's express Statement of Purpose.
 *
 * 3. __Public License Fallback.__ Should any part of the Waiver for any reason be judged legally invalid or ineffective under applicable law, then the Waiver shall be preserved to the maximum extent permitted taking into account Affirmer's express Statement of Purpose. In addition, to the extent the Waiver is so judged Affirmer hereby grants to each affected person a royalty-free, non transferable, non sublicensable, non exclusive, irrevocable and unconditional license to exercise Affirmer's Copyright and Related Rights in the Work (i) in all territories worldwide, (ii) for the maximum duration provided by applicable law or treaty (including future time extensions), (iii) in any current or future medium and for any number of copies, and (iv) for any purpose whatsoever, including without limitation commercial, advertising or promotional purposes (the "License"). The License shall be deemed effective as of the date CC0 was applied by Affirmer to the Work. Should any part of the License for any reason be judged legally invalid or ineffective under applicable law, such partial invalidity or ineffectiveness shall not invalidate the remainder of the License, and in such case Affirmer hereby affirms that he or she will not (i) exercise any of his or her remaining Copyright and Related Rights in the Work or (ii) assert any associated claims and causes of action with respect to the Work, in either case contrary to Affirmer's express Statement of Purpose.
 *
 * 4. __Limitations and Disclaimers.__
 *
 *     a. No trademark or patent rights held by Affirmer are waived, abandoned, surrendered, licensed or otherwise affected by this document.
 *
 *     b. Affirmer offers the Work as-is and makes no representations or warranties of any kind concerning the Work, express, implied, statutory or otherwise, including without limitation warranties of title, merchantability, fitness for a particular purpose, non infringement, or the absence of latent or other defects, accuracy, or the present or absence of errors, whether or not discoverable, all to the greatest extent permissible under applicable law.
 *
 *     c. Affirmer disclaims responsibility for clearing rights of other persons that may apply to the Work or any use thereof, including without limitation any person's Copyright and Related Rights in the Work. Further, Affirmer disclaims responsibility for obtaining any necessary consents, permissions or other rights required for any use of the Work.
 *
 *     d. Affirmer understands and acknowledges that Creative Commons is not a party to this document and has no duty or obligation with respect to this CC0 or use of the Work.
 */
function createLifetime(art) {
  let closed = Boolean(art.isDestroy);
  const cleanups = /* @__PURE__ */ new Set();
  let cancel;
  const cancelled = new Promise((resolve) => {
    cancel = resolve;
  });
  function run(cleanup) {
    try {
      cleanup();
    } catch (error) {
      console.warn("Failed to clean up multiple subtitles:", error);
    }
  }
  const lifetime = {
    get closed() {
      return closed;
    },
    own(cleanup) {
      if (closed)
        run(cleanup);
      else
        cleanups.add(cleanup);
      return () => cleanups.delete(cleanup);
    },
    wait(value) {
      return Promise.race([value, cancelled]);
    },
    dispose() {
      if (closed)
        return;
      closed = true;
      cancel();
      const pending = [...cleanups].reverse();
      cleanups.clear();
      for (const cleanup of pending)
        run(cleanup);
    }
  };
  if (!closed) {
    lifetime.own(() => art.off("destroy", lifetime.dispose));
    try {
      art.on("destroy", lifetime.dispose);
    } catch (error) {
      lifetime.dispose();
      throw error;
    }
  }
  return lifetime;
}
var defaultCueSettings = {
  direction: "horizontal",
  snapToLines: true,
  linePosition: "auto",
  lineAlign: "start",
  textPosition: "auto",
  positionAlign: "auto",
  size: 100,
  alignment: "center"
};
var WebVTTParser = function(entities) {
  if (!entities) {
    entities = {
      "&amp": "&",
      "&lt": "<",
      "&gt": ">",
      "&lrm": "‎",
      "&rlm": "‏",
      "&nbsp": " "
    };
  }
  this.entities = entities;
  this.parse = function(input, mode) {
    input = input.replace(/\0/g, "�");
    var NEWLINE = /\r\n|\r|\n/, startTime = Date.now(), linePos = 0, lines = input.split(NEWLINE), alreadyCollected = false, styles = [], cues = [], errors = [];
    function err(message, col) {
      errors.push({ message, line: linePos + 1, col });
    }
    var line = lines[linePos], lineLength = line.length, signature = "WEBVTT", bom = 0, signature_length = signature.length;
    if (line[0] === "\uFEFF") {
      bom = 1;
      signature_length += 1;
    }
    if (lineLength < signature_length || line.indexOf(signature) !== 0 + bom || lineLength > signature_length && line[signature_length] !== " " && line[signature_length] !== "	") {
      err('No valid signature. (File needs to start with "WEBVTT".)');
    }
    linePos++;
    while (lines[linePos] != "" && lines[linePos] != void 0) {
      err("No blank line after the signature.");
      if (lines[linePos].indexOf("-->") != -1) {
        alreadyCollected = true;
        break;
      }
      linePos++;
    }
    while (lines[linePos] != void 0) {
      var cue;
      while (!alreadyCollected && lines[linePos] == "") {
        linePos++;
      }
      if (!alreadyCollected && lines[linePos] == void 0) break;
      cue = Object.assign({}, defaultCueSettings, {
        id: "",
        startTime: 0,
        endTime: 0,
        pauseOnExit: false,
        direction: "horizontal",
        snapToLines: true,
        linePosition: "auto",
        lineAlign: "start",
        textPosition: "auto",
        positionAlign: "auto",
        size: 100,
        alignment: "center",
        text: "",
        tree: null
      });
      var parseTimings = true;
      if (lines[linePos].indexOf("-->") == -1) {
        cue.id = lines[linePos];
        if (/^NOTE($|[ \t])/.test(cue.id)) {
          linePos++;
          while (lines[linePos] != "" && lines[linePos] != void 0) {
            if (lines[linePos].indexOf("-->") != -1) err("Cannot have timestamp in a comment.");
            linePos++;
          }
          continue;
        }
        if (/^STYLE($|[ \t])/.test(cue.id)) {
          var style = [];
          var invalid = false;
          linePos++;
          while (lines[linePos] != "" && lines[linePos] != void 0) {
            if (lines[linePos].indexOf("-->") != -1) {
              err("Cannot have timestamp in a style block.");
              invalid = true;
            }
            style.push(lines[linePos]);
            linePos++;
          }
          if (cues.length) {
            err("Style blocks cannot appear after the first cue.");
            continue;
          }
          if (!invalid) {
            styles.push(style.join("\n"));
          }
          continue;
        }
        linePos++;
        if (lines[linePos] == "" || lines[linePos] == void 0) {
          err("Cue identifier cannot be standalone.");
          continue;
        }
        if (lines[linePos].indexOf("-->") == -1) {
          parseTimings = false;
          err("Cue identifier needs to be followed by timestamp.");
          continue;
        }
      }
      alreadyCollected = false;
      var timings = new WebVTTCueTimingsAndSettingsParser(lines[linePos], err);
      var previousCueStart = 0;
      if (cues.length > 0) {
        previousCueStart = cues[cues.length - 1].startTime;
      }
      if (parseTimings && !timings.parse(cue, previousCueStart)) {
        cue = null;
        linePos++;
        while (lines[linePos] != "" && lines[linePos] != void 0) {
          if (lines[linePos].indexOf("-->") != -1) {
            alreadyCollected = true;
            break;
          }
          linePos++;
        }
        continue;
      }
      linePos++;
      while (lines[linePos] != "" && lines[linePos] != void 0) {
        if (lines[linePos].indexOf("-->") != -1) {
          err("Blank line missing before cue.");
          alreadyCollected = true;
          break;
        }
        if (cue.text != "") cue.text += "\n";
        cue.text += lines[linePos];
        linePos++;
      }
      var cuetextparser = new WebVTTCueTextParser(cue.text, err, mode, entities);
      cue.tree = cuetextparser.parse(cue.startTime, cue.endTime);
      cues.push(cue);
    }
    cues.sort(function(a, b) {
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      if (a.endTime > b.endTime) return -1;
      if (a.endTime < b.endTime) return 1;
      return 0;
    });
    return { cues, errors, time: Date.now() - startTime, styles };
  };
};
var WebVTTCueTimingsAndSettingsParser = function(line, errorHandler) {
  var SPACE = /[\u0020\t\f]/, NOSPACE = /[^\u0020\t\f]/, line = line, pos = 0, err = function(message) {
    errorHandler(message, pos + 1);
  };
  function skip(pattern) {
    while (line[pos] != void 0 && pattern.test(line[pos])) {
      pos++;
    }
  }
  function collect(pattern) {
    var str = "";
    while (line[pos] != void 0 && pattern.test(line[pos])) {
      str += line[pos];
      pos++;
    }
    return str;
  }
  function timestamp() {
    var units = "minutes", val1, val2, val3, val4;
    if (line[pos] == void 0) {
      err("No timestamp found.");
      return;
    }
    if (!/\d/.test(line[pos])) {
      err("Timestamp must start with a character in the range 0-9.");
      return;
    }
    val1 = collect(/\d/);
    if (val1.length > 2 || parseInt(val1, 10) > 59) {
      units = "hours";
    }
    if (line[pos] != ":") {
      err("No time unit separator found.");
      return;
    }
    pos++;
    val2 = collect(/\d/);
    if (val2.length != 2) {
      err("Must be exactly two digits.");
      return;
    }
    if (units == "hours" || line[pos] == ":") {
      if (line[pos] != ":") {
        err("No seconds found or minutes is greater than 59.");
        return;
      }
      pos++;
      val3 = collect(/\d/);
      if (val3.length != 2) {
        err("Must be exactly two digits.");
        return;
      }
    } else {
      if (val1.length != 2) {
        err("Must be exactly two digits.");
        return;
      }
      val3 = val2;
      val2 = val1;
      val1 = "0";
    }
    if (line[pos] != ".") {
      err('No decimal separator (".") found.');
      return;
    }
    pos++;
    val4 = collect(/\d/);
    if (val4.length != 3) {
      err("Milliseconds must be given in three digits.");
      return;
    }
    if (parseInt(val2, 10) > 59) {
      err("You cannot have more than 59 minutes.");
      return;
    }
    if (parseInt(val3, 10) > 59) {
      err("You cannot have more than 59 seconds.");
      return;
    }
    return parseInt(val1, 10) * 60 * 60 + parseInt(val2, 10) * 60 + parseInt(val3, 10) + parseInt(val4, 10) / 1e3;
  }
  function parseSettings(input, cue) {
    var settings = input.split(SPACE), seen = [];
    for (var i = 0; i < settings.length; i++) {
      if (settings[i] == "") continue;
      var index = settings[i].indexOf(":"), setting = settings[i].slice(0, index), value = settings[i].slice(index + 1);
      if (seen.indexOf(setting) != -1) {
        err("Duplicate setting.");
      }
      seen.push(setting);
      if (value == "") {
        err("No value for setting defined.");
        return;
      }
      if (setting == "vertical") {
        if (value != "rl" && value != "lr") {
          err("Writing direction can only be set to 'rl' or 'rl'.");
          continue;
        }
        cue.direction = value;
      } else if (setting == "line") {
        if (/,/.test(value)) {
          var comp = value.split(",");
          value = comp[0];
          var lineAlign = comp[1];
        }
        if (!/^[-\d](\d*)(\.\d+)?%?$/.test(value)) {
          err("Line position takes a number or percentage.");
          continue;
        }
        if (value.indexOf("-", 1) != -1) {
          err("Line position can only have '-' at the start.");
          continue;
        }
        if (value.indexOf("%") != -1 && value.indexOf("%") != value.length - 1) {
          err("Line position can only have '%' at the end.");
          continue;
        }
        if (value[0] == "-" && value[value.length - 1] == "%") {
          err("Line position cannot be a negative percentage.");
          continue;
        }
        var numVal = value;
        var isPercent = false;
        if (value[value.length - 1] == "%") {
          isPercent = true;
          numVal = value.slice(0, value.length - 1);
          if (parseInt(value, 10) > 100) {
            err("Line position cannot be >100%.");
            continue;
          }
        }
        if (numVal === "" || isNaN(numVal) || !isFinite(numVal)) {
          err("Line position needs to be a number");
          continue;
        }
        if (lineAlign !== void 0) {
          if (!["start", "center", "end"].includes(lineAlign)) {
            err("Line alignment needs to be one of start, center or end");
            continue;
          }
          cue.lineAlign = lineAlign;
        }
        cue.snapToLines = !isPercent;
        cue.linePosition = parseFloat(numVal);
        if (parseFloat(numVal).toString() !== numVal) {
          cue.nonSerializable = true;
        }
      } else if (setting == "position") {
        if (/,/.test(value)) {
          var comp = value.split(",");
          value = comp[0];
          var positionAlign = comp[1];
        }
        if (value[value.length - 1] != "%") {
          err("Text position must be a percentage.");
          continue;
        }
        if (parseInt(value, 10) > 100 || parseInt(value, 10) < 0) {
          err("Text position needs to be between 0 and 100%.");
          continue;
        }
        numVal = value.slice(0, value.length - 1);
        if (numVal === "" || isNaN(numVal) || !isFinite(numVal)) {
          err("Line position needs to be a number");
          continue;
        }
        if (positionAlign !== void 0) {
          if (!["line-left", "center", "line-right"].includes(positionAlign)) {
            err("Position alignment needs to be one of line-left, center or line-right");
            continue;
          }
          cue.positionAlign = positionAlign;
        }
        cue.textPosition = parseFloat(numVal);
      } else if (setting == "size") {
        if (value[value.length - 1] != "%") {
          err("Size must be a percentage.");
          continue;
        }
        if (parseInt(value, 10) > 100) {
          err("Size cannot be >100%.");
          continue;
        }
        var size = value.slice(0, value.length - 1);
        if (size === void 0 || size === "" || isNaN(size)) {
          err("Size needs to be a number");
          size = 100;
          continue;
        } else {
          size = parseFloat(size);
          if (size < 0 || size > 100) {
            err("Size needs to be between 0 and 100%.");
            continue;
          }
        }
        cue.size = size;
      } else if (setting == "align") {
        var alignValues = ["start", "center", "end", "left", "right"];
        if (alignValues.indexOf(value) == -1) {
          err("Alignment can only be set to one of " + alignValues.join(", ") + ".");
          continue;
        }
        cue.alignment = value;
      } else {
        err("Invalid setting.");
      }
    }
  }
  this.parse = function(cue, previousCueStart) {
    skip(SPACE);
    cue.startTime = timestamp();
    if (cue.startTime == void 0) {
      return;
    }
    if (cue.startTime < previousCueStart) {
      err("Start timestamp is not greater than or equal to start timestamp of previous cue.");
    }
    if (NOSPACE.test(line[pos])) {
      err("Timestamp not separated from '-->' by whitespace.");
    }
    skip(SPACE);
    if (line[pos] != "-") {
      err("No valid timestamp separator found.");
      return;
    }
    pos++;
    if (line[pos] != "-") {
      err("No valid timestamp separator found.");
      return;
    }
    pos++;
    if (line[pos] != ">") {
      err("No valid timestamp separator found.");
      return;
    }
    pos++;
    if (NOSPACE.test(line[pos])) {
      err("'-->' not separated from timestamp by whitespace.");
    }
    skip(SPACE);
    cue.endTime = timestamp();
    if (cue.endTime == void 0) {
      return;
    }
    if (cue.endTime <= cue.startTime) {
      err("End timestamp is not greater than start timestamp.");
    }
    if (NOSPACE.test(line[pos])) ;
    skip(SPACE);
    parseSettings(line.substring(pos), cue);
    return true;
  };
  this.parseTimestamp = function() {
    var ts = timestamp();
    if (line[pos] != void 0) {
      err("Timestamp must not have trailing characters.");
      return;
    }
    return ts;
  };
};
var WebVTTCueTextParser = function(line, errorHandler, mode, entities) {
  this.entities = entities;
  var self = this;
  var line = line, pos = 0, err = function(message) {
    if (mode == "metadata") return;
    errorHandler(message, pos + 1);
  };
  this.parse = function(cueStart, cueEnd) {
    function removeCycles(tree) {
      const cyclelessTree = { ...tree };
      if (tree.children) {
        cyclelessTree.children = tree.children.map(removeCycles);
      }
      if (cyclelessTree.parent) {
        delete cyclelessTree.parent;
      }
      return cyclelessTree;
    }
    var result = { children: [] }, current = result, timestamps = [];
    function attach(token2) {
      current.children.push({
        type: "object",
        name: token2[1],
        classes: token2[2],
        children: [],
        parent: current
      });
      current = current.children[current.children.length - 1];
    }
    function inScope(name2) {
      var node = current;
      while (node) {
        if (node.name == name2) return true;
        node = node.parent;
      }
      return;
    }
    while (line[pos] != void 0) {
      var token = nextToken();
      if (token[0] == "text") {
        current.children.push({ type: "text", value: token[1], parent: current });
      } else if (token[0] == "start tag") {
        if (mode == "chapters") err("Start tags not allowed in chapter title text.");
        var name = token[1];
        if (name != "v" && name != "lang" && token[3] != "") {
          err("Only <v> and <lang> can have an annotation.");
        }
        if (name == "c" || name == "i" || name == "b" || name == "u" || name == "ruby") {
          attach(token);
        } else if (name == "rt" && current.name == "ruby") {
          attach(token);
        } else if (name == "v") {
          if (inScope("v")) {
            err("<v> cannot be nested inside itself.");
          }
          attach(token);
          current.value = token[3];
          if (!token[3]) {
            err("<v> requires an annotation.");
          }
        } else if (name == "lang") {
          attach(token);
          current.value = token[3];
        } else {
          err("Incorrect start tag.");
        }
      } else if (token[0] == "end tag") {
        if (mode == "chapters") err("End tags not allowed in chapter title text.");
        if (token[1] == current.name) {
          current = current.parent;
        } else if (token[1] == "ruby" && current.name == "rt") {
          current = current.parent.parent;
        } else {
          err("Incorrect end tag.");
        }
      } else if (token[0] == "timestamp") {
        if (mode == "chapters") err("Timestamp not allowed in chapter title text.");
        var timings = new WebVTTCueTimingsAndSettingsParser(token[1], err), timestamp = timings.parseTimestamp();
        if (timestamp != void 0) {
          if (timestamp <= cueStart || timestamp >= cueEnd) {
            err("Timestamp must be between start timestamp and end timestamp.");
          }
          if (timestamps.length > 0 && timestamps[timestamps.length - 1] >= timestamp) {
            err("Timestamp must be greater than any previous timestamp.");
          }
          current.children.push({ type: "timestamp", value: timestamp, parent: current });
          timestamps.push(timestamp);
        }
      }
    }
    while (current.parent) {
      if (current.name != "v") {
        err("Required end tag missing.");
      }
      current = current.parent;
    }
    return removeCycles(result);
  };
  function nextToken() {
    var state = "data", result = "", buffer = "", classes = [];
    while (line[pos - 1] != void 0 || pos == 0) {
      var c = line[pos];
      if (state == "data") {
        if (c == "&") {
          buffer = c;
          state = "escape";
        } else if (c == "<" && result == "") {
          state = "tag";
        } else if (c == "<" || c == void 0) {
          return ["text", result];
        } else {
          result += c;
        }
      } else if (state == "escape") {
        if (c == "<" || c == void 0) {
          err("Incorrect escape.");
          let m;
          if (m = buffer.match(/^&#([0-9]+)$/)) {
            result += String.fromCharCode(m[1]);
          } else {
            if (self.entities[buffer]) {
              result += self.entities[buffer];
            } else {
              result += buffer;
            }
          }
          return ["text", result];
        } else if (c == "&") {
          err("Incorrect escape.");
          result += buffer;
          buffer = c;
        } else if (/[a-z#0-9]/i.test(c)) {
          buffer += c;
        } else if (c == ";") {
          let m;
          if (m = buffer.match(/^&#(x?[0-9]+)$/)) {
            result += String.fromCharCode("0" + m[1]);
          } else if (self.entities[buffer + c]) {
            result += self.entities[buffer + c];
          } else if (m = Object.keys(entities).find((n) => buffer.startsWith(n))) {
            result += self.entities[m] + buffer.slice(m.length) + c;
          } else {
            err("Incorrect escape.");
            result += buffer + ";";
          }
          state = "data";
        } else {
          err("Incorrect escape.");
          result += buffer + c;
          state = "data";
        }
      } else if (state == "tag") {
        if (c == "	" || c == "\n" || c == "\f" || c == " ") {
          state = "start tag annotation";
        } else if (c == ".") {
          state = "start tag class";
        } else if (c == "/") {
          state = "end tag";
        } else if (/\d/.test(c)) {
          result = c;
          state = "timestamp tag";
        } else if (c == ">" || c == void 0) {
          if (c == ">") {
            pos++;
          }
          return ["start tag", "", [], ""];
        } else {
          result = c;
          state = "start tag";
        }
      } else if (state == "start tag") {
        if (c == "	" || c == "\f" || c == " ") {
          state = "start tag annotation";
        } else if (c == "\n") {
          buffer = c;
          state = "start tag annotation";
        } else if (c == ".") {
          state = "start tag class";
        } else if (c == ">" || c == void 0) {
          if (c == ">") {
            pos++;
          }
          return ["start tag", result, [], ""];
        } else {
          result += c;
        }
      } else if (state == "start tag class") {
        if (c == "	" || c == "\f" || c == " ") {
          if (buffer) {
            classes.push(buffer);
          }
          buffer = "";
          state = "start tag annotation";
        } else if (c == "\n") {
          if (buffer) {
            classes.push(buffer);
          }
          buffer = c;
          state = "start tag annotation";
        } else if (c == ".") {
          if (buffer) {
            classes.push(buffer);
          }
          buffer = "";
        } else if (c == ">" || c == void 0) {
          if (c == ">") {
            pos++;
          }
          if (buffer) {
            classes.push(buffer);
          }
          return ["start tag", result, classes, ""];
        } else {
          buffer += c;
        }
      } else if (state == "start tag annotation") {
        if (c == ">" || c == void 0) {
          if (c == ">") {
            pos++;
          }
          buffer = buffer.split(/[\u0020\t\f\r\n]+/).filter(function(item) {
            if (item) return true;
          }).join(" ");
          return ["start tag", result, classes, buffer];
        } else {
          buffer += c;
        }
      } else if (state == "end tag") {
        if (c == ">" || c == void 0) {
          if (c == ">") {
            pos++;
          }
          return ["end tag", result];
        } else {
          result += c;
        }
      } else if (state == "timestamp tag") {
        if (c == ">" || c == void 0) {
          if (c == ">") {
            pos++;
          }
          return ["timestamp", result];
        } else {
          result += c;
        }
      } else {
        err("Never happens.");
      }
      pos++;
    }
  }
};
var WebVTTSerializer = function() {
  function serializeTimestamp(seconds) {
    const ms = ("00" + (seconds - Math.floor(seconds)).toFixed(3) * 1e3).slice(-3);
    let h = 0, m = 0, s = 0;
    if (seconds >= 3600) {
      h = Math.floor(seconds / 3600);
    }
    m = Math.floor((seconds - 3600 * h) / 60);
    s = Math.floor(seconds - 3600 * h - 60 * m);
    return (h ? h + ":" : "") + ("" + m).padStart(2, "0") + ":" + ("" + s).padStart(2, "0") + "." + ms;
  }
  function serializeCueSettings(cue) {
    var result = "";
    const nonDefaultSettings = Object.keys(defaultCueSettings).filter((s) => cue[s] !== defaultCueSettings[s]);
    if (nonDefaultSettings.includes("direction")) {
      result += " vertical:" + cue.direction;
    }
    if (nonDefaultSettings.includes("alignment")) {
      result += " align:" + cue.alignment;
    }
    if (nonDefaultSettings.includes("size")) {
      result += " size:" + cue.size + "%";
    }
    if (nonDefaultSettings.includes("lineAlign") || nonDefaultSettings.includes("linePosition")) {
      result += " line:" + cue.linePosition + (cue.snapToLines ? "" : "%") + (cue.lineAlign && cue.lineAlign != defaultCueSettings.lineAlign ? "," + cue.lineAlign : "");
    }
    if (nonDefaultSettings.includes("textPosition") || nonDefaultSettings.includes("positionAlign")) {
      result += " position:" + cue.textPosition + "%" + (cue.positionAlign && cue.positionAlign !== defaultCueSettings.positionAlign ? "," + cue.positionAlign : "");
    }
    return result;
  }
  function serializeTree(tree) {
    var result = "";
    for (var i = 0; i < tree.length; i++) {
      var node = tree[i];
      if (node.type == "text") {
        result += node.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      } else if (node.type == "object") {
        result += "<" + node.name;
        if (node.classes) {
          for (var y = 0; y < node.classes.length; y++) {
            result += "." + node.classes[y];
          }
        }
        if (node.value) {
          result += " " + node.value;
        }
        result += ">";
        if (node.children) result += serializeTree(node.children);
        result += "</" + node.name + ">";
      } else if (node.type == "timestamp") {
        result += "<" + serializeTimestamp(node.value) + ">";
      } else {
        result += "<" + node.value + ">";
      }
    }
    return result;
  }
  function serializeCue(cue) {
    return (cue.id !== void 0 ? cue.id + "\n" : "") + serializeTimestamp(cue.startTime) + " --> " + serializeTimestamp(cue.endTime) + serializeCueSettings(cue) + "\n" + serializeTree(cue.tree.children) + "\n\n";
  }
  function serializeStyle(style) {
    return "STYLE\n" + style + "\n\n";
  }
  this.serialize = function(cues, styles) {
    var result = "WEBVTT\n\n";
    if (styles) {
      for (var i = 0; i < styles.length; i++) {
        result += serializeStyle(styles[i]);
      }
    }
    for (var i = 0; i < cues.length; i++) {
      result += serializeCue(cues[i]);
    }
    return result;
  };
};
function parseTracks(vtts, subtitles) {
  const parser = new WebVTTParser();
  return vtts.map((vtt, index) => {
    const tree = parser.parse(vtt, "metadata");
    return { ...tree, url: subtitles[index].url, name: subtitles[index].name };
  });
}
function serializeTracks(trees) {
  const cues = [];
  for (const selected of trees) {
    const tree = selected;
    for (const cue of tree.cues) {
      cues.push({
        ...cue,
        tree: {
          ...cue.tree,
          children: cue.tree.children.map((child) => ({
            ...child,
            value: `<div class="art-subtitle-${tree.name}">${child.value}</div>`
          }))
        }
      });
    }
  }
  return new WebVTTSerializer().serialize(cues);
}
function createRenderer(art, lifetime, unescape) {
  let current = null;
  function own(url) {
    let freed = false;
    let release = () => {
    };
    const entry = {
      free() {
        if (freed)
          return;
        freed = true;
        release();
        URL.revokeObjectURL(url);
      }
    };
    release = lifetime.own(entry.free);
    return entry;
  }
  return (vtt) => {
    if (lifetime.closed)
      return;
    const url = URL.createObjectURL(new Blob([vtt], { type: "text/vtt" }));
    const entry = own(url);
    if (lifetime.closed)
      return;
    const previous = current;
    let option;
    let escape;
    let configured = false;
    current = entry;
    try {
      option = art.option.subtitle;
      escape = option.escape;
      if (lifetime.closed || current !== entry)
        return;
      option.escape = false;
      configured = true;
      const config = { ...option, url, type: "vtt", onVttLoad: unescape };
      if (lifetime.closed || current !== entry)
        return;
      const pending = art.subtitle.init(config);
      Promise.resolve(pending).catch((error) => {
        if (current === entry) {
          current = null;
          entry.free();
        }
        if (!lifetime.closed)
          console.warn("Failed to initialize multiple subtitles:", error);
      });
    } catch (error) {
      if (current === entry) {
        current = previous;
        if (configured && option.escape === false)
          option.escape = escape;
      }
      entry.free();
      throw error;
    } finally {
      if (previous !== current)
        previous?.free();
      if (entry !== current)
        entry.free();
    }
  };
}
async function loadVtt(option, { getExt, srtToVtt, assToVtt }, lifetime) {
  if (lifetime.closed)
    return;
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const release = lifetime.own(() => controller?.abort());
  try {
    const url = option.url;
    if (lifetime.closed)
      return;
    const response = await lifetime.wait(controller ? fetch(url, { signal: controller.signal }) : fetch(url));
    if (lifetime.closed)
      return;
    if (response.ok === false)
      throw new Error(`Failed to fetch multiple subtitles: HTTP ${response.status}`);
    const buffer = await lifetime.wait(response.arrayBuffer());
    if (lifetime.closed)
      return;
    const text = new TextDecoder(option.encoding || "utf-8").decode(buffer);
    switch (option.type || getExt(option.url)) {
      case "srt":
        return srtToVtt(text);
      case "ass":
        return assToVtt(text);
      case "vtt":
        return text;
      default:
        return "";
    }
  } catch (error) {
    controller?.abort();
    throw error;
  } finally {
    release();
  }
}
function artplayerPluginMultipleSubtitles({ subtitles = [] }) {
  return async (art) => {
    const { unescape, getExt, srtToVtt, assToVtt } = art.constructor.utils;
    const lifetime = createLifetime(art);
    const render = createRenderer(art, lifetime, unescape);
    let trees = [];
    function setTracks(selected) {
      if (!lifetime.closed)
        render(serializeTracks(selected));
    }
    const result = {
      name: "multipleSubtitles",
      tracks(names = []) {
        if (!lifetime.closed)
          setTracks(names.map((name) => trees.find((tree) => tree.name === name)));
      },
      reset() {
        setTracks(trees);
      }
    };
    try {
      if (lifetime.closed)
        return result;
      const vtts = await Promise.all(subtitles.map((option) => loadVtt(option, { getExt, srtToVtt, assToVtt }, lifetime)));
      if (lifetime.closed)
        return result;
      trees = parseTracks(vtts, subtitles);
      setTracks(trees);
      return result;
    } catch (error) {
      lifetime.dispose();
      throw error;
    }
  };
}
export {
  artplayerPluginMultipleSubtitles as default
};
