/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState, useRef } from 'react';
import GenericTemplate from "./GenericTemplate";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
 
function SubComponent() {

  const wsUrl = 'wss://' + window.location.host + '/ws';
  const terminalRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const xterm = new Terminal({
    cursorBlink: true,
    tabStopWidth: 8,
    convertEol: true,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fitAddon = new FitAddon()
  xterm.loadAddon(fitAddon)

  useEffect(() => {
    if(terminalRef.current && !terminalRef.current.children.length) {
      xterm.open(terminalRef.current)
      const ws = new WebSocket(wsUrl);
      xterm.focus()
      fitAddon.fit()
      xterm.onData((data) => {
        xterm.write(data)
      })
      xterm.onKey(({key}) => {
        if (key.charCodeAt(0) === 13){
          xterm.write('\n')
        }
      })

      ws.onmessage = (event) => {
        xterm.write('\n')
        xterm.write(event.data)
      }
      
      ws.onopen = () => {
        xterm.loadAddon(new AttachAddon(ws))
      }
      ws.onerror = (e) =>  { console.log(e) }
      ws.onclose = () => {
        const red = `\x1b[31m`
        xterm.writeln('\n' + red + 'WEBSOCKET DISCONNECTED, PRESS ESC TO EXIT')
        xterm.setOption('disableStdin', true)
        xterm.onKey(({key}) => {
          if (key.length === 1 && key.charCodeAt(0) === 27){
            xterm.dispose()
          }
        })
      }
    }
  }, [xterm, terminalRef, fitAddon, wsUrl])

    return (
      <GenericTemplate>

        <div ref={terminalRef} id='terminal'></div>

      </GenericTemplate>
    );
}

export default SubComponent;