import { Injectable } from '@nestjs/common';
import figlet from 'figlet';
import appConfig from 'src/config/app.config';

@Injectable()
export class TemplatesService {
  private readonly config = appConfig();
  generateOtpTemplate(
    otp: number,
    subject: string = 'Your One-Time Password (OTP)',
    message: string = 'Here is your OTP for verification:',
  ): string {
    const htmlTemplate = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f7f7f7;
                }
                .email-container {
                  width: 100%;
                  padding: 20px;
                  background-color: #f7f7f7;
                  text-align: center;
                }
                .email-content {
                  width: 100%;
                  max-width: 600px;
                  background-color: #ffffff;
                  padding: 40px;
                  border-radius: 8px;
                  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                  margin: 0 auto;
                }
                .email-header {
                  margin-bottom: 20px;
                  font-size: 24px;
                  color: #333333;
                }
                .otp-box {
                  background-color: #007bff;
                  color: #ffffff;
                  font-size: 32px;
                  font-weight: bold;
                  padding: 10px 20px;
                  border-radius: 4px;
                  margin: 20px 0;
                }
                .message {
                  font-size: 16px;
                  color: #555555;
                  line-height: 1.5;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 14px;
                  color: #888888;
                }
                @media (max-width: 600px) {
                  .email-content {
                    padding: 20px;
                  }
                  .otp-box {
                    font-size: 28px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="email-content">
                  <div class="email-header">
                    ${subject}
                  </div>
                  <div class="message">
                    <p>Hello,</p>
                    <p>${message}</p>
                    <div class="otp-box">
                      ${otp}
                    </div>
                    <p>If you did not request this, please ignore this email.</p>
                  </div>
                  <div class="footer">
                    <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;
    return htmlTemplate;
  }

  homeTemplate(): string {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>Hypernova Server — All Systems Go</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@500&display=swap');
            * { margin:0; padding:0; box-sizing:border-box; }
            body {
              height:100vh;
              overflow:hidden;
              font-family:'Orbitron',sans-serif;
              display:flex; align-items:center; justify-content:center;
              background: linear-gradient(135deg, #0b0f20, #05070c);
              position:relative;
            }
            .particles {
              position:absolute; width:100%; height:100%; background:#05070c;
              background: radial-gradient(circle at center, #001022 0%, #000 80%);
              z-index:0; overflow:hidden;
            }
            .particle {
              position:absolute; background:#00f6ff;
              opacity:0.6; border-radius:50%;
              animation: drift 6s ease-in-out infinite;
            }
            @keyframes drift {
              0% { transform: translate(0,0) scale(0.5); }
              50% { transform: translate(var(--dx), var(--dy)) scale(1); }
              100% { transform: translate(0,0) scale(0.5); }
            }
            .main {
              position:relative; z-index:2;
              background: rgba(0,0,0,0.5);
              padding:3rem 4rem;
              border:2px solid #00f6ff; border-radius:20px;
              box-shadow:
                0 0 20px #00f6ff,
                0 0 40px #ff00ff,
                0 0 80px #00f6ff;
              animation: pulseBox 5s ease-in-out infinite;
              text-align:center;
            }
            @keyframes pulseBox {
              0%,100% { transform:scale(1); box-shadow:0 0 20px #00f6ff,0 0 40px #ff00ff; }
              50% { transform:scale(1.05); box-shadow:0 0 60px #00f6ff,0 0 80px #ff00ff; }
            }
            .icon {
              font-size:6rem; color:#00f6ff;
              text-shadow:0 0 30px #00f6ff,0 0 60px #ff00ff;
              animation: rotateGlow 7s linear infinite;
            }
            @keyframes rotateGlow { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
            h1 {
              margin:1rem 0; font-size:3rem; color:#fff;
              text-shadow:0 0 20px #00f6ff,0 0 40px #ff00ff;
              animation: flicker 4s infinite;
            }
            @keyframes flicker {
              0%,100% { opacity:1; }
              40%,60% { opacity:0.7; }
            }
            p {
              color:#ccc; font-family:'Rajdhani',sans-serif;
              font-size:1.3rem;
            }
          </style>
        </head>
        <body>
          <div class="particles" id="particles"></div>
          <div class="main">
            <div class="icon">🚀</div>
            <h1>Hypernova Server Online</h1>
            <p>System fully operational. All channels green, ready for hyperspace requests!</p>
          </div>
          <script>
            const container = document.getElementById('particles');
            for(let i=0;i<15;i++){
              const p=document.createElement('div');
              p.classList.add('particle');
              const size=Math.random()*8+4;
              p.style.width=\`\${size}px\`;
              p.style.height=\`\${size}px\`;
              p.style.top=\`\${Math.random()*100}%\`;
              p.style.left=\`\${Math.random()*100}%\`;
              p.style.setProperty('--dx', (Math.random()*200-100)+'px');
              p.style.setProperty('--dy', (Math.random()*200-100)+'px');
              p.style.animationDelay=\`\${Math.random()*3}s\`;
              container.appendChild(p);
            }
          </script>
        </body>
        </html>`;
  }

  async figletChalkTemplate() {
    const chalk = (await import('chalk')).default;
    return figlet('OOAAOW', (err, data) => {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }

      // Print the title with color
      console.log(chalk.green(data));

      // Print version info and system details with color
      console.log(chalk.cyan('VERSION INFO:'));
      console.log(chalk.yellow('Template: 1.0'));
      console.log(chalk.magenta('Node.js: v20.16.0'));
      console.log(chalk.blue('OS: windows'));
    });
  }

  serverHealthTemplate(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">

          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Oops, Server is Actually a Supernova!</title>
            <style>
              /* All your previous styles remain unchanged */
              @keyframes rotateGradient {
                0% {
                  transform: rotate(0deg);
                  opacity: 0.7;
                }

                50% {
                  opacity: 1;
                }

                100% {
                  transform: rotate(360deg);
                  opacity: 0.7;
                }
              }

              @keyframes colorShift {
                0% {
                  filter: hue-rotate(0deg);
                }

                100% {
                  filter: hue-rotate(360deg);
                }
              }

              @keyframes glowText {

                0%,
                100% {
                  text-shadow:
                    0 0 20px #00ffea,
                    0 0 40px #00ffea,
                    0 0 80px #00ffd5,
                    0 0 120px #00ffd5;
                  color: #00ffe0;
                  transform: scale(1);
                }

                50% {
                  text-shadow:
                    0 0 60px #00ffd5,
                    0 0 100px #00ffd5,
                    0 0 140px #00ffd5;
                  color: #00fff5;
                  transform: scale(1.05);
                }
              }

              @keyframes pulseBounce {

                0%,
                100% {
                  transform: scale(1) translateY(0);
                }

                50% {
                  transform: scale(1.1) translateY(-10px);
                }
              }

              @keyframes pulseRing {

                0%,
                100% {
                  box-shadow:
                    0 0 25px #00ff00,
                    0 0 40px #ffff00,
                    0 0 60px #00ff00;
                }

                50% {
                  box-shadow:
                    0 0 50px #ffff00,
                    0 0 70px #00ff00,
                    0 0 100px #ffff00;
                }
              }

              /* Floating particles */
              @keyframes floatParticles {
                0% {
                  transform: translateY(0) translateX(0);
                  opacity: 0.7;
                }

                50% {
                  transform: translateY(-20px) translateX(15px);
                  opacity: 1;
                }

                100% {
                  transform: translateY(0) translateX(0);
                  opacity: 0.7;
                }
              }

              body {
                margin: 0;
                height: 100vh;
                background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Orbitron', sans-serif;
                text-align: center;
                overflow: hidden;
                color: #00ffe0;
                position: relative;
              }

              /* Ambient floating particles */
              .particle {
                position: absolute;
                border-radius: 50%;
                background: #00ffe0;
                opacity: 0.7;
                filter: blur(3px);
                animation: floatParticles 6s ease-in-out infinite;
              }

              .particle:nth-child(1) {
                width: 12px;
                height: 12px;
                top: 15%;
                left: 20%;
                animation-delay: 0s;
              }

              .particle:nth-child(2) {
                width: 8px;
                height: 8px;
                top: 30%;
                left: 75%;
                animation-delay: 2s;
              }

              .particle:nth-child(3) {
                width: 10px;
                height: 10px;
                top: 60%;
                left: 40%;
                animation-delay: 4s;
              }

              .particle:nth-child(4) {
                width: 6px;
                height: 6px;
                top: 80%;
                left: 65%;
                animation-delay: 3s;
              }

              .particle:nth-child(5) {
                width: 14px;
                height: 14px;
                top: 50%;
                left: 10%;
                animation-delay: 1s;
              }

              /* Wrapper to hold container and animated glowing ring */
              .container-wrapper {
                position: relative;
                width: 640px;
                height: 640px;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              /* Pulsating glow behind container */
              .glow-pulse {
                position: absolute;
                inset: -40px;
                border-radius: 50%;
                background: radial-gradient(circle at center, #00ff00, transparent 70%);
                animation: pulseRing 4s ease-in-out infinite;
                filter: blur(40px);
                z-index: 0;
              }

              /* The glowing ring that rotates behind the container with color shift */
              .glowing-ring {
                position: absolute;
                inset: -20px;
                border-radius: 50%;
                padding: 20px;
                background: conic-gradient(from 0deg,
                    #00ff00,
                    #ffff00,
                    #00ff00,
                    #ffff00,
                    #00ff00);
                animation:
                  rotateGradient 6s linear infinite,
                  colorShift 20s linear infinite;
                -webkit-mask: radial-gradient(farthest-side,
                    transparent calc(100% - 20px),
                    black calc(100% - 19px));
                mask: radial-gradient(farthest-side,
                    transparent calc(100% - 20px),
                    black calc(100% - 19px));
                z-index: 1;
                filter: drop-shadow(0 0 25px #00ff00) drop-shadow(0 0 40px #ffff00) drop-shadow(0 0 60px #00ff00);
                opacity: 0.8;
              }

              /* The circular container */
              .container {
                position: relative;
                width: 600px;
                height: 600px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.75);
                box-sizing: border-box;
                padding: 50px;
                z-index: 2;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                user-select: none;
              }

              .icon {
                font-size: 140px;
                margin-bottom: 20px;
                animation:
                  glowText 3s ease-in-out infinite,
                  pulseBounce 3s ease-in-out infinite;
                will-change: transform, text-shadow;
              }

              h1 {
                font-size: 4rem;
                margin: 0;
                letter-spacing: 0.1em;
                animation: glowText 4s ease-in-out infinite;
                will-change: text-shadow, transform;
              }

              p {
                font-size: 1.5rem;
                font-weight: 400;
                color: #a0fff5cc;
                margin: 0 20px;
                line-height: 1.5;
              }

              /* New copyright line fixed bottom right */
              .copyright {
                position: fixed;
                bottom: 15px;
                right: 15px;
                font-size: 0.9rem;
                color: #40ffb0cc;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                user-select: none;
                pointer-events: none;
                z-index: 9999;
                filter: drop-shadow(0 0 2px #00ffb0);
              }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&amp;display=swap" rel="stylesheet">
          </head>

          <body cz-shortcut-listen="true">
            <!-- Floating ambient particles -->
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>

            <div class="container-wrapper">
              <div class="glow-pulse"></div>
              <div class="glowing-ring"></div>
              <div class="container">
                <div class="icon">⚡</div>
                <h1>Server is Running</h1>
                <p>
                  Hello World! from ${this.config.common.appName}
                </p>
              </div>
            </div>

            <div class="copyright">
              <p>© 2025 OOAAOW | All rights reserved</p>
            </div>

            <div id="volume-booster-visusalizer">
              <div class="sound">
                <div class="sound-icon"></div>
                <div class="sound-wave sound-wave_one"></div>
                <div class="sound-wave sound-wave_two"></div>
                <div class="sound-wave sound-wave_three"></div>
              </div>
              <div class="segments-box">
                <div data-range="1-20" class="segment"><span></span></div>
                <div data-range="21-40" class="segment"><span></span></div>
                <div data-range="41-60" class="segment"><span></span></div>
                <div data-range="61-80" class="segment"><span></span></div>
                <div data-range="81-100" class="segment"><span></span></div>
              </div>
            </div>
          </body>

    </html>
    `;
  }
}
