import { useEffect, useState } from "react";
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";

import * as pkg from "../pkg/index.js";

const rust_zip=(file:File,buf:ArrayBuffer,setTime:React.Dispatch<React.SetStateAction<number>>)=>{
  const startTime = performance.now();

  const f = pkg.zip_file(
    file.name,
    new Uint8Array(buf),
  );
  const content=new Blob([f.buffer]);

  const endTime = performance.now();
  setTime(endTime - startTime);

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(content);
  link.download = `fuga-${+new Date()}.zip`;
  link.click();
}

const js_zip=async (file:File,buf:ArrayBuffer,setTime:React.Dispatch<React.SetStateAction<number>>)=>{
  const startTime = performance.now();

  const zip = new JSZip();
  zip.addFile(file.name,new Uint8Array(buf))

  const content=await zip.generateAsync({type:'blob',compression: "DEFLATE"})

  const endTime = performance.now();
  setTime(endTime - startTime);

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(content);
  link.download = `hoge-${+new Date()}.zip`;
  link.click();
}

export default () => {
  const [loading, setLoading] = useState(false);
  const [laungage, setLaungage]=useState("JS");
  const [time,setTime]=useState(0);
  useEffect(() => {
    (async () => {
      await pkg.default();
    })();
  }, []);

  return (
    <div>
      <select value={laungage} onChange={ e => setLaungage(e.target.value) }>
	      <option value="JS" >JS</option>
	      <option value="Rust" >Rust</option>
    	</select>
      <br/>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files === null) {
            return;
          }
          console.log(e.target.files[0]);
          setLoading(true);
          e.target.files[0].arrayBuffer().then(async (buf) => {
            try {
              if (e.target.files === null) {
                return;
              }
              if(laungage==="JS"){
                await js_zip(e.target.files[0],buf,setTime)
              }else{
                rust_zip(e.target.files[0],buf,setTime)
              }

              setLoading(false);
            } catch (error) {
              console.log(error);
              setLoading(false);
            }
          });
        }}
      >
      </input>
      {loading && <>Loading...</>}
      {!loading&& <>{time} ms</>}
    </div>
  );
};
