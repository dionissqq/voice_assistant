import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import alanBtn from '@alan-ai/alan-sdk-web';
import { Card, ListGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GUI } from 'dat.gui'
import Board from './Board'
import Wheel from './Wheel'
import './styles.css'
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';
import Balance from './Balance';
//TODO:
// add animations:
// * listening


let alanBtnInstance;

function App() {

    let modelsWidth = 600
    let modelsHeight = 400
    let aspect = modelsWidth / modelsHeight

    let rouletteWheelNumbers = [ 
        0, 32, 15, 19, 4, 21, 2, 25,
        17, 34, 6, 27, 13, 36, 11,
        30, 8, 23,10, 5, 24, 16, 33,
        1, 20, 14, 31, 9, 22, 18, 29,
        7, 28, 12, 35, 3, 26
      ];
    let rouletteData = {
        numbers: rouletteWheelNumbers
      }

    let toAddPlaces = [[{type: 'NUMBER', value: 8}, {sum: 5}], [{type: 'RED', value: undefined}, {sum: 10}],[{type: 'NUMBER', value: 17}, {sum: 100}], [{type: 'ODD', value: undefined}, {sum: 50}]]
    let balances = [1995, 1985, 2165, 2065, 2015, 2015]
    let babanceNumber = 0;
    let chipsBets = 0;  
    let winningNumbers = [8, 28]
    let round = 0
    let winResults = [true, false]
    let result = 0;

    const [chipsData, setChipsData] = useState({
        selectedChip: null,
        placedChips: new Map()
      })
    
    const [number, setNumber] = useState({next: undefined})
    const [balance, setBalance] = useState(2000)

    function addBet() {
        console.log('chipsData')
        console.log(chipsData)
        let map =  chipsBets >= 2 ? new Map() : chipsData.placedChips
        if (chipsBets == 3) {
            map.set(toAddPlaces[2][0], toAddPlaces[2][1])
        }
        setChipsData({
            selectedChip: null,
            placedChips: map.set(toAddPlaces[chipsBets][0], toAddPlaces[chipsBets][1])
          })
        setBalance(balances[babanceNumber++])
        chipsBets++
        setAction(animationActions[1])
        setTimeout((_) => setAction(animationActions[4]), 2000);
    }

    function parseCommand(command) {
        console.log('command')
        console.log(command)
        if (command.command == 'put money')
            addBet();
        else if (command.command == 'roll')
            startRoulette()
    }

    function startRoulette() {
        setNumber({next: winningNumbers[round]})
        round++;
        setAction(animationActions[0])
        alanBtnInstance.playText('Lets roll');

        setTimeout(() => {
            let phrase = ''
            setNumber({next: undefined})
            setChipsData({
                selectedChip: null,
                placedChips: new Map()
              })
            setBalance(balances[babanceNumber++])
            if (!winResults[result]) {
                setAction(animationActions[3])
                phrase = 'Bad for you, try again'
            } else {
                setAction(animationActions[2])
                phrase = 'Congratulations, lets win more'
            }
            result++;
            setTimeout(() =>  {
                setAction(animationActions[0])
                alanBtnInstance.playText(phrase)
                setTimeout(() => {
                    setAction(animationActions[4])
                }, 2500);
            }, 3000);
        }, 5500);
    }

    const animationActions = []
    let activeAction 
    let lastAction

    const animations = {
        default: function () {
            setAction(animationActions[0])
        },
        samba: function () {
            setAction(animationActions[1])
        },
        bellydance: function () {
            setAction(animationActions[2])
        },
        goofyrunning: function () {
            setAction(animationActions[3])
        },
        nothing: function () {
            setAction(animationActions[4])
        }
    }
    
    const setAction = (toAction) => {
        if (toAction != activeAction) {
            lastAction = activeAction
            activeAction = toAction
            //lastAction.stop()
            lastAction.fadeOut(1)
            activeAction.reset()
            activeAction.fadeIn(1)
            activeAction.play()
        }
    }

  useEffect(() => {

   
    

    alanBtnInstance = alanBtn({
      key: "d9ea2b9f08f9dbf3396e8174265e6f412e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand : parseCommand
    });
    
    const scene = new THREE.Scene()

    // scene.background = new THREE.Color( 0xffffff );
    
    const light1 = new THREE.PointLight(0xffffff, 2)
    light1.position.set(2.5, 2.5, 2.5)
    scene.add(light1)
    
    const light2 = new THREE.PointLight(0xffffff, 2)
    light2.position.set(-2.5, 2.5, 2.5)
    scene.add(light2)
    
    const camera = new THREE.PerspectiveCamera(
        75,
        aspect,
        0.1,
        1000
    )
    camera.position.set(0.8, 2, 1.0)
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize(modelsWidth, modelsHeight)
    document.getElementById("myThreejsCanvas").appendChild(renderer.domElement)
    
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 1, 0)
    
    let mixer
    let modelReady = false
    
    
    const gltfLoader = new GLTFLoader()
    
    gltfLoader.load(
        'models/saying_prod.glb',
        (gltf) => {
            // gltf.scene.scale.set(.01, .01, .01)
    
            mixer = new THREE.AnimationMixer(gltf.scene)
    
            const animationAction = mixer.clipAction((gltf).animations[0])
            animationActions.push(animationAction)
            animationsFolder.add(animations, 'default')
            activeAction = animationActions[0]
            modelReady = true
    
    
            scene.add(gltf.scene)
    
            //add an animation from another file
            gltfLoader.load(
                'models/letsgo.glb',
                (gltf) => {
                    console.log('loaded samba')
                    const animationAction = mixer.clipAction(
                        (gltf).animations[0]
                    )
                    animationActions.push(animationAction)
                    animationsFolder.add(animations, 'samba')
    
                    //add an animation from another file
                    gltfLoader.load(
                        // 'models/win.glb',
                        'models/win.glb',
                        (gltf) => {
                            console.log('loaded bellydance')
                            const animationAction = mixer.clipAction(
                                (gltf).animations[0]
                            )
                            animationActions.push(animationAction)
                            animationsFolder.add(animations, 'bellydance')
    
                            //add an animation from another file
                            gltfLoader.load(
                                'models/oops.glb',
                                (gltf) => {
                                    console.log('loaded goofyrunning');
                                    (gltf).animations[0].tracks.shift() //delete the specific track that moves the object forward while running
                                    const animationAction = mixer.clipAction(
                                        (gltf).animations[0]
                                    )
                                    animationActions.push(animationAction)
                                    animationsFolder.add(animations, 'goofyrunning')
    
                                    gltfLoader.load(
                                        'models/nothinghappens.glb',
                                        (gltf) => {
                                            console.log('loaded nothing');
                                            (gltf).animations[0].tracks.shift() //delete the specific track that moves the object forward while running
                                            const animationAction = mixer.clipAction(
                                                (gltf).animations[0]
                                            )
                                            animationActions.push(animationAction)
                                            animationsFolder.add(animations, 'nothing')
                                            setAction(animationActions[4])
            
                                            
                                        },
                                        (xhr) => {
                                            console.log(
                                                (xhr.loaded / xhr.total) * 100 + '% loaded'
                                            )
                                        },
                                        (error) => {
                                            console.log(error)
                                        }
                                    )
                                },
                                (xhr) => {
                                    console.log(
                                        (xhr.loaded / xhr.total) * 100 + '% loaded'
                                    )
                                },
                                (error) => {
                                    console.log(error)
                                }
                            )
                        },
                        (xhr) => {
                            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                        },
                        (error) => {
                            console.log(error)
                        }
                    )
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            )
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
    
    // window.addEventListener('resize', onWindowResize, false)
    // function onWindowResize() {
    //     camera.aspect = 1
    //     camera.updateProjectionMatrix()
    //     renderer.setSize(600, 400)
    //     render()
    // }
    
    
    
    
    const gui = new GUI()
    const animationsFolder = gui.addFolder('Animations')
    animationsFolder.open()
    
    const clock = new THREE.Clock()
    
    function animate() {
        requestAnimationFrame(animate)
    
        controls.update()
    
        if (modelReady) mixer.update(clock.getDelta())
    
        render()
    
    }
    
    function render() {
        renderer.render(scene, camera)
    }
    
    animate()

  }, []);

  const activateCb = useCallback(() => {
    alanBtnInstance.activate();
  }, []);


  const deactivateCb = useCallback(() => {
    alanBtnInstance.deactivate();
  }, []);

  const activateAndPlayTextCb = useCallback(async () => {
    await alanBtnInstance.activate();
    await alanBtnInstance.playText("Nice to meet you");
    alert('sd');
  }, []);

  const callProjectApiCb = useCallback(async () => {
    alanBtnInstance.callProjectApi("sendAnswer", { answer: 'correct' }, (err, data) => {
    });
  }, []);


  return (
    <div className="App">
        <Balance balance={balance}></Balance>
      <div id = "myThreejsCanvas" style={{marginLeft: '700px'}}></div>
        <Wheel rouletteData={rouletteData} number={number}></Wheel>
        <Board chipsData={chipsData} ></Board>
      {/* <h1>Alan SDK Web Api Test</h1>
      <Card>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Button onClick={activateCb}>activate();</Button>
            <br />
            <br />
            <div><b>Result:</b> Alan Button will be activated.</div>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button onClick={deactivateCb}>deactivate();</Button>
            <br />
            <br />
            <div><b>Result:</b> Alan Button will be deactivated.</div>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button onClick={activateAndPlayTextCb}>activate(); and playText('Nice to meet you');</Button>
            <br />
            <br />
            <div><b>Result:</b> Alan Button will be activated and text will be played.</div>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button onClick={callProjectApiCb}>callProjectApi();</Button>
            <br />
            <br />
            <div><b>Result:</b> Alan Button calls "callProjectApi('"sendAnswer"');" method and send there answer "correct". Activate Alan Button and ask "Am I right?". The response will be "You are right"</div>
            Alan Voice Script:
            <pre><code>{
              `
projectAPI.sendAnswer = function(p, param, callback) {
    p.userData.answer = param.answer;
    callback(null,'answer was saved');
};
 
intent("Am I right?", p => {
    let answer = p.userData.answer;
    switch (answer) {
        case "correct":
            p.play("You are right");
            break;
        case "incorrect":
            p.play("You are wrong");
            break;
        default:
            p.play("(Sorry,|) I have no data");
    }
});
              `
            }</code></pre>

          </ListGroup.Item>
        </ListGroup>
      </Card> */}
    </div >
  );
}

export default App;
