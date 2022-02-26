/**
 * @flow
 */
"use strict";

import { NativeModules, NativeEventEmitter, Platform } from "react-native";
const { RNSoundPlayer } = NativeModules;

const _soundPlayerEmitter = new NativeEventEmitter(RNSoundPlayer);
let _finishedPlayingListener = null;
let _finishedLoadingListener = null;

export default {
  playSoundFile: (name: string, type: string) => {
    RNSoundPlayer.playSoundFile(name, type);
  },

  playSoundFileWithDelay: (name: string, type: string, delay: number) => {
    RNSoundPlayer.playSoundFileWithDelay(name, type, delay);
  },

  loadSoundFile: (name: string, type: string) => {
    RNSoundPlayer.loadSoundFile(name, type);
  },

  setNumberOfLoops: (loops: number) => {
    RNSoundPlayer.setNumberOfLoops(loops);
  },

  playData: (base64String: string) => {
    const asdf = "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";
    RNSoundPlayer.playData(asdf);
  },

  playUrl: (url: string) => {
    RNSoundPlayer.playUrl(url);
  },

  loadUrl: (url: string) => {
    RNSoundPlayer.loadUrl(url);
  },

  onFinishedPlaying: (callback: (success: boolean) => any) => {
    if (_finishedPlayingListener) {
      _finishedPlayingListener.remove();
      _finishedPlayingListener = undefined;
    }

    _finishedPlayingListener = _soundPlayerEmitter.addListener(
      "FinishedPlaying",
      callback
    );
  },

  onFinishedLoading: (callback: (success: boolean) => any) => {
    if (_finishedLoadingListener) {
      _finishedLoadingListener.remove();
      _finishedLoadingListener = undefined;
    }

    _finishedLoadingListener = _soundPlayerEmitter.addListener(
      "FinishedLoading",
      callback
    );
  },

  addEventListener: (
    eventName:
      | "FinishedLoading"
      | "FinishedPlaying"
      | "FinishedLoadingURL"
      | "FinishedLoadingFile"
      | "FinishedLoadingData",
    callback: Function
  ) => _soundPlayerEmitter.addListener(eventName, callback),

  play: () => {
    // play and resume has the exact same implementation natively
    RNSoundPlayer.resume();
  },

  pause: () => {
    RNSoundPlayer.pause();
  },

  resume: () => {
    RNSoundPlayer.resume();
  },

  stop: () => {
    RNSoundPlayer.stop();
  },

  seek: (seconds: number) => {
    RNSoundPlayer.seek(seconds);
  },

  setVolume: (volume: number) => {
    RNSoundPlayer.setVolume(volume);
  },

  setSpeaker: (on: boolean) => {
    if (Platform.OS === "android" || Platform.isTVOS) {
      console.log("setSpeaker is not implemented on Android or tvOS");
    } else {
      RNSoundPlayer.setSpeaker(on);
    }
  },

  setMixAudio: (on: boolean) => {
    if (Platform.OS === "android") {
      console.log("setMixAudio is not implemented on Android");
    } else {
      RNSoundPlayer.setMixAudio(on);
    }
  },

  getInfo: async () => RNSoundPlayer.getInfo(),

  unmount: () => {
    if (_finishedPlayingListener) {
      _finishedPlayingListener.remove();
      _finishedPlayingListener = undefined;
    }

    if (_finishedLoadingListener) {
      _finishedLoadingListener.remove();
      _finishedLoadingListener = undefined;
    }
  },
};
