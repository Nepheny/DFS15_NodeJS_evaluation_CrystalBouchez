const run = () => {
    if (location.pathname.includes("/contacts")) {
        archive();

    } else if (location.pathname.includes("/form/create")) {
        create();

    } else if (location.pathname.includes("/form/update")) {
        update();
    } else {
        all();
    }
};

const all = () => {
    document.getElementById('all').addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        fetch('/contacts').then(result => result.json()).then(result => {
          if(result.ok && result.nbResults) {
            document.getElementById('container').innerHTML = '' ;
            result.result.forEach(l => {
              document.getElementById('container').innerHTML += l ;
            });
          }
        });
      });
};

const archive = () => {
    document.getElementById('delete').addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        fetch(`/contacts/${event.target[0].value}`, {method: "DELETE"}).then(() => {
            window.location.replace("http://localhost:3000");
        });
    });
};

const update = () => {
    document.getElementById('form').addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        let values = {};
        let phones = [];
        let emails = [];

        for (let input of event.target) {
            if (input.name === 'phones[]') {
                if (input.value !== '') phones.push(input.value);

            } else if (input.name === 'emails[]') {
                if (input.value !== '') emails.push(input.value);
                
            } else if (input.name !== '') {
                values = { ...values, [input.name]: input.value };
            }
        }

        values = {...values, phones, emails};

        console.log(values)

        fetch(`/contacts/${values.id}`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
          }).then(() => {
            window.location.replace("http://localhost:3000");
        });
    });
}

const create = () => {
    document.getElementById('form').addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        let values = {};
        let phones = [];
        let emails = [];

        for (let input of event.target) {
            if (input.name === 'phones[]') {
                if (input.value !== '') phones.push(input.value);

            } else if (input.name === 'emails[]') {
                if (input.value !== '') emails.push(input.value);
                
            } else if (input.name !== '') {
                values = { ...values, [input.name]: input.value };
            }
        }

        values = {...values, phones, emails};

        fetch('/contacts', {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(values)
        }).then(() => {
          window.location.replace("http://localhost:3000");
        });
    });
};

window.addEventListener('DOMContentLoaded', run);