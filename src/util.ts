export function post<T>(url: string, params: {}) {
  return new Promise<T>((resolve, reject) => {
    fetch(url, {
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'cors',
    }).then(data => {
      if (data.ok) {
        resolve(data.json() as Promise<T>);
      } else {
        reject([data.status, data.body]);
      }
    }).catch(reason => reject(reason));
  });
}

