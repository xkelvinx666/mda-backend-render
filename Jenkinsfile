pipeline {
  agent {
    docker {
      image 'node'
      args '''
'''
    }

  }
  stages {
    stage('git pull') {
        steps {
            git branch: 'master',
            credentialsId: 'b2ec09ae-ca45-4884-8b8b-bd65d3e43475',
            url: 'https://github.com/xkelvinx666/mda-backend-render'
        }
    }
    stage('build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage('compile') {
      steps {
        sh 'npm run template 1 /root/template'
      }
    }
  }
}
