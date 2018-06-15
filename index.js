'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = app.listen(5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);});

app.post('/events', (req, res) => {
  let q = req.body;
  console.log('*** Event triggered');
  console.log(q);
  // 1. To see if the request is coming from Slack
  if (q.token !== 'lZZuEg026h5rk5bMmjYGiLSl') {
    res.sendStatus(400);
    return;
  }
  // 2. Events - get the message text
  else if (q.type === 'event_callback') {
    if(!q.event.text) return;
    analyzeTone(q.event); // sentiment analysis
    res.sendStatus(200);
  }
});

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var tone_analyzer = new ToneAnalyzerV3({
	version: '2017-09-21',
	username: '95561493-386d-4708-a75a-849ca5f8e18a',
	password: 'lS1LuOegbYjY'
});


function analyzeTone(ev) {
  let text = ev.text;

  let regex = /(^:.*:$)/; // Slack emoji, starts and ends with :
  if(regex.test(text)) {
    text = text.replace(/_/g , ' ');
    text = text.replace(/:/g , '');
  }
  const confidencethreshold = 0.55; 
  tone_analyzer.tone({text: text}, (err, tone) => {
    if (err) {
      console.log(err);
    } else {
      // let tones = tone.document_tone.tone_categories.[0].tones;
      for(let i = 0; i < tone_categories.length; i++){
let tones = tone.document_tone.tone_categories.[i].tones;
        if(emotion.score >= confidencethreshold) { // pulse only if the likelihood of an emotion is above the given confidencethreshold
              postEmotion(emotion, ev)
            }
      }
      // tone.document_tone.tone_categories.forEach((tonecategory) => {
      //   if(tonecategory.category_id === 'emotion_tone'){
      //     console.log(tonecategory.tones);
      //     tonecategory.tones.forEach((emotion) => {
      //       if(emotion.score >= confidencethreshold) { // pulse only if the likelihood of an emotion is above the given confidencethreshold
      //         postEmotion(emotion, ev)
      //       }
      //     })
      //   }
      // })
    }
  });
}

function postEmotion(emotion, ev) { 
  let message = 'feeling ' + emotion.tone_id; 
  let options = { 
    method: 'POST', 
    uri: 'https://slack.com/api/chat.postMessage', 
    form: { 
      token: 'xoxb-381412241953-383051932183-pnarEQ0uI8cnJfRe4GaPQMwk', // Your Slack OAuth token 
      channel: ev.channel, 
      text: message, 
      as_user: false, 
      username: 'Aura' 
    } 
  }; 
  // Use Request module to POST 
  request(options, (error, response, body) => { 
    if (error) { console.log(error) } 
  }); 
}