const getURL = () => {
  const url =
    process?.env?.URL ?? process?.env?.VERCEL_URL ?? 'http://localhost:3000';
  return url.includes('http') ? url : `https://${url}`;
};

const postData = ({ url, token, data = {} }) =>
  fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  }).then((res) => res.json());

const toDateTime = (secs) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};


const getCoffeesStatus = (n) => {
  let rep = n % 10

  if (rep === 0) rep = 10

  let dots = []

  for (var i = 0; i < 10 ;i++) {
    dots.push(
      <div key={i} className="outer-ring justify-self-center rounded-full w-10 h-10 bg-primary flex justify-center items-center">
        <div className={`inner-ring rounded-full w-5 h-5 ${i+1 <= rep && "bg-accents-7"}`}>
        </div>
      </div>
    )
  }

  return dots
} 

export { getURL, postData, toDateTime, getCoffeesStatus };
