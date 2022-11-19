pipeline {
    agent any
    stages {
        stage('Install') {
            steps {

                echo "Npm install..."
                sh "npm install"
            }
        }
        stage('Package') {
            steps {
                echo "Compiling with parcel..."
                sh "npx parcel build src/main.html"
            }
        }
        stage('Docker'){
            steps {
                echo "Building docker..."
                sh "docker build . -t campus-front"
                echo "Login to Ilieff docker repo"
                sh "docker login docker.ilieff.fr -u charles -pM7%bqs3L3jawUJ"
                echo "Push docker..."
                sh "docker push docker.ilieff.fr/campus-front"
            }
       }
   }
}