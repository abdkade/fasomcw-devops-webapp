pipeline {
  agent any

  stages {
    
  
    stage('build image'){
        steps{
            
            sh 'docker login $ACR_LOGIN -u $ACR_USERNAME -p $ACR_PASSWORD'
            sh 'docker build -t $ACR_LOGIN/fasomcwbestapp .'
        
     }
    }
    stage('pushing image'){
        steps{
            
            sh 'docker push $ACR_LOGIN/fasomcwbestapp'
        
     } 
   
  }
  stage('Run image locally'){
    steps{
      sh 'docker rm -f ng'
       sh 'docker run --name ng -d -p 3000:4200 $ACR_LOGIN/fasomcwbestapp'
    }
  }
}
}
