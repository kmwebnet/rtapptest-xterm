/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useRef } from 'react';
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
 
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBarSpacer: theme.mixins.toolbar,
  })
);


function SubComponent() {

  const wsUrl = 'wss://' + window.location.host + '/ws';
  const terminalRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const xterm = new Terminal({
    cursorBlink: true,
    fontFamily: "Consolas, 'Courier New', monospace",
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
      /*
      xterm.onData((data) => {
        xterm.write(data)
      })
      */
      /*
      xterm.onKey(({key}) => {
        if (key.charCodeAt(0) === 13){
          xterm.write('\n')
        }
      })
      */
      /*
      ws.onmessage = (event) => {
        if (event.data != '') {
          xterm.write('\n')
          xterm.write(event.data)
        }
      };
      */

      ws.onopen = () => {
        xterm.loadAddon(new AttachAddon(ws))
      }
      ws.onerror = (e) =>  { console.log(e) }
      ws.onclose = () => {
        const red = `\x1b[31m`
        xterm.writeln('\n' + red + 'WEBSOCKET DISCONNECTED')
        xterm.setOption('disableStdin', true)
      }
    }
  }, [xterm, terminalRef, fitAddon, wsUrl])
  useEffect(() => () => xterm.dispose(), [xterm]) ; 

  const classes = useStyles();
    return (
      <>
        <div className={classes.appBarSpacer} />
        <div  ref={terminalRef} id='terminal'></div>
      </>  
    );
}

export default SubComponent;