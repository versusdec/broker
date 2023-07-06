import {Box, Dialog, DialogContent, Stack, Typography} from "@mui/material";
import React, {useEffect, useState} from 'react';
import {Verto} from 'vertojs';
import {Button} from "../../components/button";

const Page = () => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [hold, setHold] = useState(false);
  const [dialog, setDialog] = useState(false);
  
  useEffect(() => {
    const JsonRpcClientParams = {
      socketUrl: 'wss://ws.koala-call.com/',
      login: '14',
      passwd: 'testtest',
    }
    
    const vertoConfig = {
      transportConfig: JsonRpcClientParams,
      // Verto transport configuration, check below
      
      rtcConfig: {},
      // RTCConfiguration object, as described here
      // https://developer.mozilla.org/en-US/docs/Web/API/RTCConfiguration
      // The most important thing is iceServers item that should be set to go over NAT
      
      debug: true
      // Set true to get some useful debug info in browser console
      
      // ice_timeout?    : number
      // Milliseconds to stop waiting for ice candidates, default to 3000ms
    };
    
    let client = new Verto(vertoConfig)
    
    client.login(vertoConfig);
    
    setClient(client);
    
    return () => {
      client.logout();
    };
  }, []);
  
  const makeCall = async () => {
    if (client) {
      const local_stream = await navigator.mediaDevices.getUserMedia({audio: true})
      
      const call = client.call(local_stream.getTracks(), "82222")
      
      call.subscribeEvent('track', (track) => {
        if (track.kind !== 'audio') return
        
        let stream = new MediaStream()
        stream.addTrack(track)
        
        // let el = document.getElementById('video')
        // el.srcObject = stream
      })
      
      setCall(call);
    }
  };
  
  const holdCall = () => {
    if (call) {
      call.hold();
    }
  };
  
  const unholdCall = () => {
    if (call) {
      call.unhold();
    }
  };
  
  const hangUpCall = () => {
    if (call) {
      call.hangup();
      setCall(null);
    }
  };
  
  const sendDTMF = (tones) => {
    if (call) {
      call.dtmf(tones);
    }
  };
  
  return (
    <Stack direction={'row'} spacing={2}>
      <Button onClick={makeCall}>Make Call</Button>
      {!hold && <Button onClick={() => {
        setHold(true)
        holdCall()
      }}>Hold Call</Button>}
      {hold && <Button onClick={() => {
        unholdCall()
        setHold(false)
      }}>Unhold Call</Button>}
      <Button onClick={hangUpCall}>Hang Up</Button>
      <Button onClick={() => setDialog(true)}>Send DTMF</Button>
      <Dialog
        open={dialog}
        onClose={() => {
          setDialog(false)
        }}
      >
        <Stack direction={'row'} flexWrap={'wrap'} maxWidth={300}>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('1')
          }}>1</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('2')
          }}>2</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('3')
          }}>3</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('4')
          }}>4</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('5')
          }}>5</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('6')
          }}>6</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('7')
          }}>7</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('8')
          }}>8</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('9')
          }}>9</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('*')
          }}>*</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('0')
          }}>0</Button>
          <Button variant={'text'} sx={{width: 100, borderRadius: 0}} onClick={() => {
            sendDTMF('#')
          }}>#</Button>
        </Stack>
      </Dialog>
    </Stack>
  );
};

export default Page