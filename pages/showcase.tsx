import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTransition, animated } from "react-spring";
import { GET_IMAGE, HOST } from "../commons/env";
import { getRandomPhotoIds } from "../utility/photo";

const transitions_arr = [
  {
    from: {
      clipPath: 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)',
    },
    enter: {
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
    },
    leave: {
      clipPath: 'polygon(100% 0%, 100% 100%, 100% 100%, 100% 0%)',
    }
  },
  {
    from: {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)',
    },
    enter: {
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
    },
    leave: {
      clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
    }
  },
  {
    from: {
      clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    },
    enter: {
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
    },
    leave: {
      clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    }
  },
  {
    from: {
      clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)',
    },
    enter: {
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
    },
    leave: {
      clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
    }
  },
  {
    from: {
      clipPath: 'polygon(0% 50%, 0% 50%, 100% 50%, 100% 50%)',
    },
    enter: {
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
    },
    leave: {
      clipPath: 'polygon(0% 50%, 0% 50%, 100% 50%, 100% 50%)',
    }
  },
  {
    from: {
      clipPath: 'polygon(50% 0%, 50% 100%, 50% 100%, 50% 0%)',
    },
    enter: {
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
    },
    leave: {
      clipPath: 'polygon(50% 0%, 50% 100%, 50% 100%, 50% 0%)',
    }
  },
  {
    from: {
      clipPath: 'polygon(25% 25%, 25% 25%, 25% 25%, 25% 25%)',
    },
    enter: {
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
    },
    leave: {
      clipPath: 'polygon(25% 25%, 25% 25%, 25% 25%, 25% 25%)',
    }
  }
]

// const HOST = "http://localhost:3000";
const image_url = (id: string) => `${HOST}${GET_IMAGE}/${id}`;

type ShowcaseProps = {
    photo_ids: string[]
}

export async function getServerSideProps() {
    const id = getRandomPhotoIds(20);
    return {
        props: {
            photo_ids: id
        }
    }
}

export default function Page({ photo_ids }: ShowcaseProps) {
    const router = useRouter();
    const [index, setIndex] = useState<number>(0);
    const num = Math.floor(Math.random() * transitions_arr.length);
    const transition = useTransition(index, {
        key: index,
        from: transitions_arr[num].from,
        enter: transitions_arr[num].enter,
        leave: transitions_arr[num].leave,
        config: { duration: 700 },
        onRest: (_a: any, _b: any, item: any) => {
        setTimeout(() => {
            if (index === item) {
            setIndex(state => (state + 1) % photo_ids.length);
            }
        }, 2000)
        },
        exitBeforeEnter: true,
    })
    return (<div>
      <Head>
        <title>Albience - Showcase</title>
        <link rel="icon" href="/camera.png"/>
      </Head>
      {
        transition((style, i) => (
          <>
            <animated.div style={{
              backgroundImage: `url(${image_url(photo_ids[i])})`,
              backgroundSize: "cover",
              width: "100vw",
              height: "100vh",
              ...style
            }}
            onClick={_ => {
                setTimeout(_ => router.reload(), 2000);
            }}
            >
              <animated.div style={{
                margin: "0px",
                fontSize: "1rem",
                fontWeight: "normal",
                backgroundColor: "white",
                display: "inline-block"
              }}>{image_url(photo_ids[i])}</animated.div>
            </animated.div>
          </>
        ))
      }
    </div>)
}