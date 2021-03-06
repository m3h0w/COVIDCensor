import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import Typist from 'react-typist';
import ReactTimer from '@xendora/react-timer';
import GA from '../utils/googleAnalytics';
import { useRouter } from 'next/router';

const FORBIDDEN_STRINGS = [
  'corona',
  'pandemic',
  'epidemic',
  'virus',
  'demic',
  'infection',
  'infect',
  'flu',
  'bat',
  'cancelled',
  'nineteen',
  '19',
  '1919',
  'covid',
  'ovid',
  'vid',
  'wuhan',
  'han',
];
function beep() {
  var snd = new Audio(
    'data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU='
  );
  snd.play();
}

const MAIN_COLOR = `#eb2100`;
const BLACK = `#000000`;

const Home = () => {
  const [recognitionOn, setRecognitionOn] = useState(false);
  const recognitionRef = useRef();
  const recognitionListRef = useRef();
  const [detectedString, setDetectedString] = useState(' ');
  const [someInfo, setSomeInfo] = useState(null);
  const [error, setError] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!GA.isInitialized()) {
      GA.init();
    }
    GA.pageView();
  }, [router.route]);

  useEffect(() => {
    GA.init();
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    window.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    if (SpeechRecognition) {
      console.log('speech rec supported');
      recognitionRef.current = new SpeechRecognition();
      recognitionListRef.current = new SpeechGrammarList();
    } else {
      console.error('speech rec not supported');
      setError('Speech recognition is not supported in your browser. Try Chrome instead.');
    }

    navigator.permissions
      .query({ name: 'microphone' })
      .then(function (permissionStatus) {
        if (permissionStatus.state === 'denied') {
          setError(
            `Microphone permission denied. Can't censor without it :( To give access, click on the icon next to the website url in your browser and select 'allow' next to the microphone.`
          );
        }

        permissionStatus.onchange = function () {
          if (permissionStatus.state === 'denied') {
            setError(
              `Microphone permission denied. Can't censor without it :( To give access, click on the icon next to the website url in your browser and select 'allow' next to the microphone.`
            );
          }
          if (permissionStatus.state === 'granted') {
            setError(null);
          }
        };
      })
      .catch((e) => {});
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      if (recognitionOn) {
        recognitionRef.current.start();
        console.log('Started rec.');
      } else {
        recognitionRef.current.stop();
        console.log('Stopped rec.');
      }
    }
  }, [recognitionOn, recognitionRef.current]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 3;
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
          setDetectedString((prev) => `${prev} ${event.results[i][0].transcript}`);
        }
      };
    }
  }, [recognitionRef.current]);

  useEffect(() => {
    if (recognitionRef.current) {
      var colors = [
        'corona',
        'virus',
        'coronavirus',
        'pandemic',
        'epidemic',
        'flu',
        'symptoms',
        'infection',
        'infections',
        ...FORBIDDEN_STRINGS,
      ];
      var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';
      recognitionListRef.current.addFromString(grammar, 1);
      recognitionRef.current.grammars = recognitionListRef.current;
    }
  }, [recognitionRef.current, recognitionListRef.current]);

  useEffect(() => {
    if (detectedString) {
      console.log(detectedString);
      FORBIDDEN_STRINGS.forEach((forbiddenWord) => {
        if (
          detectedString
            .split(' ')
            .map((v) => v.replace(' ', ''))
            .includes(forbiddenWord)
        ) {
          setDetectedString('');
          beep();
          beep();
          beep();
          beep();
          beep();
          beep();
          beep();
          beep();
          setTimeout(() => {
            beep();
            beep();
            beep();
            beep();
            beep();
            beep();
            beep();
            beep();
          }, 100);
        }
      });
    }
  }, [detectedString]);

  return (
    <div className='container'>
      <Head>
        <title>Evil Covid Censor</title>
        <meta name='description' content='Take a break and keep the pandemic out of the conversation. For a minute.' />
        <meta
          property='og:description'
          content='Take a break and keep the pandemic out of the conversation. For a minute.'
        />
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
        ></link>
      </Head>

      <main>
        <div className='title-container'>
          {someInfo && someInfo !== ' ' && (
            <Typist
              avgTypingDelay={50}
              cursor={{
                show: false,
              }}
              onTypingDone={() => {
                setTimeout(() => {
                  setSomeInfo(' ');
                }, someInfo.length * 5);
              }}
            >
              <p>{someInfo}</p>
            </Typist>
          )}
          {someInfo === ' ' && (
            <p
              className='info-button'
              onClick={() => {
                const info = `Not so evil, really. It's just that some domain providers right now don't allow domain names that mention covid and this one made sense in reverse. Also, turn on the sound.`;
                setSomeInfo(info);
              }}
            >
              i
            </p>
          )}
        </div>
        <Typist
          cursor={{
            show: false,
          }}
          onTypingDone={() => {
            setSomeInfo(' ');
          }}
        >
          <div className='title-container'>
            <h1 className='title'>
              <a href='https://github.com/m3h0w/COVIDCensor' target='_blank'>
                rosnec
              </a>
              divoc.live
            </h1>
            <Typist.Delay ms={800} />
            <h1 className='title-space'>&nbsp;|&nbsp;</h1>
            <h1 className='title'>
              evil.covid
              <a href='https://github.com/m3h0w/COVIDCensor' target='_blank'>
                censor
              </a>
            </h1>
          </div>
        </Typist>

        <p className='description'>Take a break and keep the pandemic out of the conversation. For a minute.</p>
        <p className='sub-description'>(The censor will help you with a beep)</p>

        {!error ? (
          <div className='grid'>
            <button
              className={`card${recognitionOn ? ' card-playing' : ''}`}
              onClick={() => {
                setRecognitionOn((prev) => !prev);
              }}
            >
              <h3>{!recognitionOn ? `Censor ▶️` : `😈 Listening... ⏸`}</h3>
            </button>
          </div>
        ) : (
          <div
            style={{
              color: '#ff0000',
              fontSize: '0.7rem',
              width: '80%',
              height: '100%',
              textAlign: 'center',
              margin: '5vh',
            }}
          >
            {error}
          </div>
        )}
        {recognitionOn && (
          <div className='timer-container'>
            <h1>
              <ReactTimer
                start={60}
                end={(value) => value === 0}
                onEnd={(value) => setRecognitionOn(false)}
                onTick={(value) => value - 1}
              >
                {(time) => <div style={{ textAlign: 'center' }}>{time}</div>}
              </ReactTimer>
            </h1>
          </div>
        )}
      </main>

      <footer>
        Made by&nbsp;
        <a href='https://github.com/m3h0w/' target='_blank'>
          m3h0w
        </a>
      </footer>

      <style jsx>{`
        h1,
        h4,
        p {
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
            Droid Sans, Helvetica Neue, sans-serif;
        }

        .Typist > p {
          margin: 0;
        }

        .container {
          min-height: 100vh;
          padding: 0 0.3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .info-button {
          border: 1px solid #ccc;
          border-radius: 50%;
          width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          cursor: pointer;
          margin-bottom: -10px;
        }

        .info-button:hover {
          border: 1px solid ${MAIN_COLOR};
          border-radius: 45%;
          color: ${MAIN_COLOR};
          font-weight: 900;
        }

        .timer-container {
          display: 'flex';
          justify-content: 'center';
        }

        main {
          width: 100%;
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          color: ${MAIN_COLOR};
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          min-width: 50px;
          min-height: 30px;
          margin-bottom: 1vh;
        }

        .title-space {
          font-weight: 100;
          font-size: 50px;
        }

        .title a {
          color: ${MAIN_COLOR};
          text-decoration: none;
        }

        a:hover,
        a:focus,
        a:active {
          text-decoration: underline;
        }

        .title,
        .title-space {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1;
          font-size: 1.5rem;
          margin: 0;
        }

        .sub-description {
          margin: 0;
          line-height: 1.3;
          font-size: 1rem;
        }

        @media only screen and (max-width: 600px) {
          .title,
          .title-space {
            margin: 0;
            line-height: 1.15;
            font-size: 1.2rem;
          }

          .description {
            font-size: 0.9rem;
          }

          .sub-description {
            margin-top: 0;
            font-size: 0.7rem;
          }
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono,
            Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 300px;
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: 0.5s;
        }

        .card:hover {
          color: ${MAIN_COLOR};
          cursor: pointer;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        }

        .card:focus,
        .card:active {
          outline: none;
        }

        .card-playing {
          color: ${MAIN_COLOR};
        }

        .card h3 {
          /* margin: 0 0 1rem 0; */
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
            Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
