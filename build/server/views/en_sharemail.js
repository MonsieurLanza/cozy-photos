var jade = require('jade/runtime');
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (displayName, displayEmail, doc, url) {
buf.push("<!DOCTYPE html><html style=\"height:100%;\"><head><meta name=\"viewport\" content=\"width=device-width\"><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"></head><body style=\"height:100%; margin:0;\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; height: 100%; padding:0; margin:0; background-color: #F4F4F4; font-family: Helvetica,Arial,Verdana,sans-serif; color: #333; font-size: 0.9em; line-height: 1.6;\"><tr><td align=\"center\" valign=\"top\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; max-width: 600px; padding: 2em 0.5em;\"><tr><td><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; max-width: 600px; background-color: #FFF; border-radius: 8px; border: 1px solid #DDD;\"><tr><th style=\"border-radius: 8px 8px 0 0; border-bottom: 1px solid #DDD;\"><img src=\"cid:cozy-logo\" width=\"63\" height=\"48\" style=\"padding: 12px 0; margin: auto;\"></th></tr><tr><!-- TODO: add user's email inside the brackets #{displayEmail}--><td style=\"padding: 1.5em;\">" + (jade.escape((jade_interp = displayName) == null ? '' : jade_interp)) + " (" + (jade.escape((jade_interp = displayEmail) == null ? '' : jade_interp)) + ") shared an album called \"" + (jade.escape((jade_interp = doc.title) == null ? '' : jade_interp)) + "\" with you via Cozy Cloud.</td></tr><tr><td style=\"padding: 0.5em 1.5em 2em; width: 100%;\"><a" + (jade.attr("href", url, true, true)) + " style=\"display: block; width: 60%; margin: 0 auto; padding: 1.2em 2em; background-color: #34A6FF; border-radius: 5px; color: #FFF; text-decoration: none; text-align: center; font-size: 1em; font-weight: bold; cursor:pointer;\">View album</a></td></tr></table></td></tr><tr style=\"padding-top: 10px; text-align: center; font-size: 0.85em; font-style: italic; color: #999;\"><td><p>Sent from&nbsp;<a href=\"http://cozy.io\" style=\"color: #34A6FF; text-decoration: none;\">" + (jade.escape((jade_interp = displayName) == null ? '' : jade_interp)) + "'s Cozy</a>.</p></td></tr></table></td></tr></table></body></html>");}.call(this,"displayName" in locals_for_with?locals_for_with.displayName:typeof displayName!=="undefined"?displayName:undefined,"displayEmail" in locals_for_with?locals_for_with.displayEmail:typeof displayEmail!=="undefined"?displayEmail:undefined,"doc" in locals_for_with?locals_for_with.doc:typeof doc!=="undefined"?doc:undefined,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined));;return buf.join("");
}