const currentUrl = window.location.href;
const urlParams = new URLSearchParams(new URL(currentUrl).search);
const projectId = urlParams.get("id");
console.log("projectId: ", projectId);
fetch(`http://localhost:3002/api/projects/${projectId}`)
  .then((response) => response.json())
  .then((project) => {
    console.log("project details: ", project);
    const title = document.getElementById('projectTitle');
    title.innerHTML = project.projectTitle
    document.getElementById('projectDescription').innerHTML = project.description
    document.getElementById('projectImage').innerHTML = `<img src="${project.imageUrl}" alt="${project.projectTitle}">`
    document.getElementById('projectImage2').innerHTML = `<img src="${project.imageUrl}" alt="${project.projectTitle}">`
    document.getElementById('price1').innerHTML = `INR ${project.pricing}`
    document.getElementById('price2').innerHTML = `INR ${project.pricing}`
    document.getElementById('project1').innerHTML = `${project.noOfSubProjects} projects`
    document.getElementById('project2').innerHTML = `${project.noOfSubProjects} projects`
    
    
    const projectContainer = document.getElementById('projectContent')
    let totalTimeDuration = 0
    project.subProjects.forEach(p => {
        const projectElement = document.createElement('div');
        projectElement.innerHTML =`
    <div class="accordion_wrap mb-5">
                        <h3 class="details_info_title mb-3">${p.projectName}</h3>
                        <div class="accordion style_2" id="corse_details_accordion">
                          <div class="accordion-item">
                            <div class="checkbox_item accordion_item_checked">
                              <input type="checkbox">
                            </div>
                            <div class="accordion-button" role="button" data-bs-toggle="collapse" data-bs-target="#collapse_one" aria-expanded="true">
                              Project Description
                            </div>
                            <div id="collapse_one" class="accordion-collapse collapse show" data-bs-parent="#corse_details_accordion">
                              <div class="accordion-body">
                                <p class="mb-3">
                                  ${p.projectDescription}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="accordion-item">
                            <div class="checkbox_item accordion_item_checked">
                              <input type="checkbox">
                            </div>
                            <div class="accordion-button" role="button" data-bs-toggle="collapse" data-bs-target="#collapse_two" aria-expanded="true">
                              Tools Used
                            </div>
                            <div id="collapse_two" class="accordion-collapse collapse show" data-bs-parent="#corse_details_accordion">
                              <div class="accordion-body">
                                <p class="mb-3">
                                  ${p.toolsUsed}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="accordion-item">
                            <div class="checkbox_item accordion_item_checked">
                              <input type="checkbox">
                            </div>
                            <div class="accordion-button" role="button" data-bs-toggle="collapse" data-bs-target="#collapse_three" aria-expanded="true">
                              Time to work
                            </div>
                            <div id="collapse_three" class="accordion-collapse collapse show" data-bs-parent="#corse_details_accordion">
                              <div class="accordion-body">
                                <p class="mb-3">
                                  ${p.timeToWorkOnProject} Hours
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
    `
    totalTimeDuration += p.timeToWorkOnProject
    projectContainer.appendChild(projectElement);
        
    })
    document.getElementById('duration1').innerHTML = `${totalTimeDuration} Hours`
    document.getElementById('duration2').innerHTML = `${totalTimeDuration} Hours`
    document.getElementById('buy1').innerHTML = `
    <form id="paymentForm-${project._id}" onsubmit="initiatePayment(event, '${project._id}', ${project.pricing})">
                        <input type="text" name="name" placeholder="Your Name" required>
                        <input type="email" name="email" placeholder="Your Email" required>
                        <input type="text" name="phone" placeholder="Your Phone Number" required>
                        <br/><br/>
                        <button type="submit" class="btn btn_dark">Buy!</button>
                    </form>
    `
    document.getElementById('buy2').innerHTML = `
    <form id="paymentForm-${project._id}" onsubmit="initiatePayment(event, '${project._id}', ${project.pricing})">
                        <input type="text" name="name" placeholder="Your Name" required>
                        <input type="email" name="email" placeholder="Your Email" required>
                        <input type="text" name="phone" placeholder="Your Phone Number" required>
                        <br/><br/>
                        <button type="submit" class="btn btn_dark">Buy!</button>
                    </form>
    `
    

  });


  function initiatePayment(event, projectId, price) {
    event.preventDefault();  // Prevent the form from submitting normally
    const form = event.target;
    const userDetails = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        projectId: projectId,
        amount: price
    };

    fetch('http://localhost:3003/api/payment/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: price, user: userDetails })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data value is: ', data)
        console.log('User details is: ', userDetails)
        openRazorpayCheckout(data, userDetails);
    })
    .catch(error => console.error('Error creating order:', error));
}

function openRazorpayCheckout(orderDetails, userDetails) {
    const options = {
        "key": "rzp_test_a6CEBoBbltCvzC",  // Your Key
        "amount": orderDetails.amount,
        "currency": "INR",
        "name": "Dey Education And Research Private Limited",
        "description": "Project Payment",
        "order_id": orderDetails.id,
        "handler": function (response) {
            console.log('Res: ', response)
            console.log('orderDetails.id:',orderDetails.id)
            console.log('userDetails:',userDetails)
            verifyPayment(response, orderDetails.id, userDetails);
        },
        "prefill": {
            "name": userDetails.name,
            "email": userDetails.email,
            "contact": userDetails.phone
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    console.log('Complete Options is: ', options)
    const paymentProcess = new Razorpay(options);
    paymentProcess.open();
}

function verifyPayment(paymentResponse, orderId, userDetails) {
    fetch('http://localhost:3003/api/payment/verify-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderCreationId: orderId,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpaySignature: paymentResponse.razorpay_signature,
            user: userDetails
        })
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: 'Success!',
            text: 'Payment verified successfully. Payment ID: ' + data.paymentId,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    })
    .catch(error => {
        console.error('Error verifying payment:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to verify payment.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}