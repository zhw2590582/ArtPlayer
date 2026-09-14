export function skippableVast(origin) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="3.0"><Ad id="artplayer-skippable"><InLine>
<AdSystem version="1">ArtPlayer test fixture</AdSystem><AdTitle>Local skippable ad</AdTitle>
<Impression><![CDATA[${origin}/assets/vast/nonlinear-320x50.png?tracking=impression]]></Impression>
<Creatives><Creative><Linear skipoffset="00:00:05"><Duration>00:00:08</Duration>
<TrackingEvents><Tracking event="skip"><![CDATA[${origin}/assets/vast/nonlinear-320x50.png?tracking=skip]]></Tracking></TrackingEvents>
<MediaFiles><MediaFile delivery="progressive" type="video/mp4" width="320" height="180"><![CDATA[${origin}/test/pattern.mp4?skippable=1]]></MediaFile></MediaFiles>
</Linear></Creative></Creatives></InLine></Ad></VAST>`
}
