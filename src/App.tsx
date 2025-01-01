import { useEffect, useState } from "react";

import './assets/css/App.css';
import './assets/css/Theme.css';
import './assets/css/Stars.css';
//Elements
import { Provider } from "./components/ui/provider"
import { Card, Textarea, Input } from "@chakra-ui/react"
import { Button } from "./components/ui/button"
import { Toaster, toaster } from "./components/ui/toaster"
import JSConfetti from 'js-confetti'
//Services
import { DBService } from './services/DBService';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { CardComponent } from "./components/CardComponent";
// import ReCAPTCHA from 'react-google-recaptcha';

function App() {
  const [data, setData] = useState<any>([]);
  const [data2, setData2] = useState<any>([]);
  const [randomItem, setRandomItem] = useState<any | null>(null);

  const [cardForm, setCardForm] = useState<boolean>(true);
  const [cardRandom, setCardRandom] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    nickname: "",
    resolution: ""
  });

  const [captcha, setCaptcha] = useState<number>();

  // const [captchaValid, setCaptchaValid] = useState(false);

  const jsConfetti = new JSConfetti()

  const showConfetti = () => {
    jsConfetti.addConfetti({confettiColors: ['yellow' , 'blue', 'red' ,'purple','pink']})
  }

  useEffect(() => {
  const fetchData = async () => {
      const querySnapshot = await getDocs(collection(DBService, "newyearnewlist"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const randomData1 = data.sort(() => Math.random() - 0.5);
      const randomData2 = data.slice().sort(() => Math.random() - 0.5);
      const randomDataItem = data[Math.floor(Math.random() * data.length)];

      setData(randomData1);
      setData2(randomData2);
      setRandomItem(randomDataItem);
    };

    fetchData();
  }, []);
  // console.log(data);
  
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCaptcha= (e:any) => {
    const { value } = e.target;
    setCaptcha(value);
  };

  const toast = (text:string,type:string) => {
    toaster.create({
          title: text,
          type: type
        })
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      // if (captchaValid) {
      if (!formData.nickname || !formData.resolution) {
        toast('Los campos están vacíos como tu alma', 'error');
        return;
      }
      if(captcha == 7){
        await addDoc(collection(DBService, "newyearnewlist"), {
          ...formData,
          timestamp: new Date(),
        });
        console.log("Se guardó el propósito correctamente");
        setFormData({ nickname: "", resolution: "" });
        toast('Se ha subido tu propósito','success');
        showConfetti();
        setTimeout(() => {
          setCardForm((prev) => !prev);
          setCardRandom((prev) => !prev);
        }, 500);
      } else {
        toast('Captcha inválido','error');
      }
    } catch (error) {
      console.error("Error al guardar: ", error);
      toast('Error','error');
    }
  };

  // const handleCaptchaChange = (value: string | null) => {
  //   if (value) {
  //     setCaptchaValid(true);
  //   } else {
  //     setCaptchaValid(false);
  //   }
  // };

  return (
    <Provider>
      <Toaster />
      <div className="main-content">
        <div className='main'>

          <section className="resolutions-content absolute-top">
            <div className="group">
                <div className="row">
                  {data.map((item: any) => (
                      <span key={item.id}>
                        <span>{item.nickname}:</span> {item.resolution}
                      </span>
                    ))}
                </div>
            </div>
          </section>
          
          <div className="titles">
            <span>New Year New List</span>
            <h1>¿Cuáles son tus propósitos para este nuevo año?</h1>
          </div>
          <div className="cardForm">
            {cardForm && (
              <Card.Root className="card">
                <form onSubmit={handleSubmit}>
                  <Card.Body gap="2" width="100%">
                    <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 576 512"><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg></div>
                    <Card.Title mt="2" className="title-question">Mis propósitos para 2025 son...</Card.Title>
                    <Card.Description>
                      <Input
                        placeholder="nickname"
                        className="input"
                        value={formData.nickname}
                        onChange={handleChange}
                        name="nickname"
                      />
                      <Textarea
                        placeholder="Tus propósitos"
                        className="input"
                        value={formData.resolution}
                        onChange={handleChange}
                        name="resolution"
                      />
                    </Card.Description>
                  </Card.Body>
                  <Card.Footer justifyContent="center">
                    <div className="flex-center-column">
                      {/* <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_API_KEY} onChange={handleCaptchaChange} /> */}
                      <div><Input className="input" type="text" placeholder="Captcha: ¿Cuánto es 2+5?" name="captcha" value={captcha} onChange={handleCaptcha} /></div>
                      <Button className="button" type="submit">Me comprometo</Button>
                    </div>
                  </Card.Footer>
                </form>
                </Card.Root>
              )}
          </div>
          {cardRandom && (
            <div id="cardRandom">
              <div className="titles">
                <span>Propósito aleatorio</span>
              </div>
              {randomItem && (
                <CardComponent nickname={randomItem.nickname} resolution={randomItem.resolution} />
                )}
            </div>
          )}

          <section className="resolutions-content absolute-bottom">
            <div className="group">
                <div className="row reverse">
                  {data2.map((item: any) => (
                      <span key={item.id}>
                        <span>{item.nickname}:</span> {item.resolution}
                      </span>
                    ))}
                </div>
            </div>
          </section>

          { /*--------------------------------------------*/ }

          <div className="stars-container">
            <div className="sky">
              <div className="stars"></div>
              <div className="stars1"></div>
              <div className="stars2"></div>
              <div className="shooting-stars"></div>
            </div>
          </div>
          { /*--------------------------------------------*/ }
        </div>
      </div>
    </Provider>
  );
}

export default App;
