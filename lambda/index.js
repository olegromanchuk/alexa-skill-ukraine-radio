const Alexa = require("ask-sdk-core");
const { getApiAudio, getUkraineNews } = require("./util");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
  },
  handle(handlerInput) {
    console.log("PlaySound");
    return controller.play(handlerInput);
  }
};

const CheckAudioInterfaceHandler = {
  async canHandle(handlerInput) {
    const audioPlayerInterface = (
      (((handlerInput.requestEnvelope.context || {}).System || {}).device || {})
        .supportedInterfaces || {}
    ).AudioPlayer;
    return audioPlayerInterface === undefined;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Sorry, this skill is not supported on this device")
      .withShouldEndSession(true)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "You can say hello to me! How can I help?";

    return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.StopIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.PauseIntent")
    );
  },
  handle(handlerInput) {
    console.log("CancelAndStopIntentHandler");
    return controller.stop(handlerInput, "Goodbye!");
  }
};

const SystemExceptionHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "System.ExceptionEncountered";
  },
  handle(handlerInput) {
    console.log("SystemExceptionHandler");
    console.log(JSON.stringify(handlerInput.requestEnvelope, null, 2));
    console.log(`System exception encountered: ${handlerInput.requestEnvelope.request.reason}`);
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log("SessionEndedRequestHandler");
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle(handlerInput) {
    console.log(handlerInput.requestEnvelope.request.type);
    return true;
  },
  handle(handlerInput, error) {
    console.log("ErrorHandler");
    console.log(error);
    console.log(`Error handled: ${error.message}`);
    const message = "Sorry, this is not a valid command. Please say help to hear what you can say.";

    return handlerInput.responseBuilder.speak(message).reprompt(message).getResponse();
  }
};

// Helpers

/**
 * Handle Audio Player Events
 */
const AudioPlayerEventHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type.startsWith("AudioPlayer.");
  },
  async handle(handlerInput) {
    const { requestEnvelope, responseBuilder } = handlerInput;
    const audioPlayerEventName = requestEnvelope.request.type.split(".")[1];

    console.log("AudioPlayerEventHandler");
    console.log(audioPlayerEventName);
    switch (audioPlayerEventName) {
      case "PlaybackStarted":
        break;
      case "PlaybackFinished":
        break;
      case "PlaybackStopped":
        break;
      case "PlaybackNearlyFinished":
        break;
      case "PlaybackFailed":
        break;
      default:
        throw new Error("Should never reach here!");
    }

    return responseBuilder.getResponse();
  }
};

const controller = {
  async play(handlerInput) {
    const url = await getUkraineNews();
    const { responseBuilder } = handlerInput;
    const playBehavior = "REPLACE_ALL";
    console.log("play");
    responseBuilder
      // .speak(`Playing news for ${query}`)
      .speak('Yo-hooo! You got it right!!! The latest news from Ukraine Odessa is playing...')
      .withShouldEndSession(true)
      .addAudioPlayerPlayDirective(playBehavior, url, url, 0, null);
    return responseBuilder.getResponse();
  },
  async stop(handlerInput, message) {
    return handlerInput.responseBuilder.speak(message).addAudioPlayerStopDirective().getResponse();
  }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    CheckAudioInterfaceHandler,
    LaunchRequestHandler,
    SystemExceptionHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    AudioPlayerEventHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
